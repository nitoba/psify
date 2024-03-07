import fastifyCookie from '@fastify/cookie'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { RawServerDefault } from 'fastify'
import request from 'supertest'
import { AuthPsychologistFactory } from 'test/factories/auth/make-auth-psychologist'
import { AuthPatientFactory } from 'test/factories/auth/make-auth-patient'
import { AvailableTimesFactory } from 'test/factories/psychologist/make-available-times'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'

describe('Fetch Available Times To Schedules To Psychologists (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let authPsychologistFactory: AuthPsychologistFactory
  let authPatientFactory: AuthPatientFactory
  let availableTimesFactory: AvailableTimesFactory
  let encrypter: Encrypter
  let drizzleService: DrizzleService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        AuthPsychologistFactory,
        AuthPatientFactory,
        AvailableTimesFactory,
        AuthPatientFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    app.register(fastifyCookie as never)
    authPsychologistFactory = moduleRef.get(AuthPsychologistFactory)
    authPatientFactory = moduleRef.get(AuthPatientFactory)
    availableTimesFactory = moduleRef.get(AvailableTimesFactory)
    encrypter = moduleRef.get(Encrypter)
    drizzleService = moduleRef.get(DrizzleService)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    vi.useRealTimers()
    await app.close()
  })

  test('[GET] /schedules/psychologists/:psychologistId/available-times', async () => {
    vi.useFakeTimers().setSystemTime(new Date(2024, 1, 25, 8))
    const patient = await authPatientFactory.makeDbPatient()
    const psychologist = await authPsychologistFactory.makeDbPsychologist()
    await availableTimesFactory.makeDbAvailableTime(
      {
        psychologistId: new UniqueEntityID(psychologist.id),
        weekday: 0,
        time: Time.create('09:00').value as Time,
      },
      psychologist.id,
    )

    const availableTimeDB =
      await drizzleService.client.query.availableTimes.findFirst({
        where({ psychologistId }, { eq }) {
          return eq(psychologistId, psychologist.id)
        },
      })

    expect(availableTimeDB).toBeDefined()

    const token = await encrypter.encrypt({
      sub: patient.id,
      role: 'patient',
    })

    const response = await request(app.getHttpServer())
      .get(`/schedules/psychologists/${psychologist.id}/available-times`)
      .set('Cookie', [`psify@access_token=${token}`])
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        availableTimesToSchedules: [
          {
            id: availableTimeDB?.id,
            weekday: availableTimeDB?.weekday,
            time: availableTimeDB?.time,
          },
        ],
      }),
    )
  })
})
