import fastifyCookie from '@fastify/cookie'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { RawServerDefault } from 'fastify'
import request from 'supertest'
import { AuthPsychologistFactory } from 'test/factories/auth/make-auth-psychologist'

import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'
import { availableTimes } from '@/infra/database/drizzle/schemas'

describe('Update Available Times To Psychologists (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let authPsychologistFactory: AuthPsychologistFactory
  let encrypter: Encrypter
  let drizzleService: DrizzleService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AuthPsychologistFactory],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    app.register(fastifyCookie)
    authPsychologistFactory = moduleRef.get(AuthPsychologistFactory)
    encrypter = moduleRef.get(Encrypter)
    drizzleService = moduleRef.get(DrizzleService)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /psychologists/available-times/:availableTimeId', async () => {
    const psychologist = await authPsychologistFactory.makeDbPsychologist()
    const [availableTimeOnDb] = await drizzleService.client
      .insert(availableTimes)
      .values({
        psychologistId: psychologist.id,
        time: '10:00',
        weekday: 1,
      })
      .returning()

    expect(availableTimeOnDb).toEqual(
      expect.objectContaining({
        weekday: 1,
        time: '10:00',
      }),
    )

    const token = await encrypter.encrypt({
      sub: psychologist.id.toString(),
      role: 'psychologist',
    })

    const response = await request(app.getHttpServer())
      .put(`/psychologists/available-times/${availableTimeOnDb.id}`)
      .set('Cookie', [`psify@access_token=${token}`])
      .send({
        weekday: 2,
        time: '12:00',
      })

    expect(response.statusCode).toBe(204)

    const availableTime =
      await drizzleService.client.query.availableTimes.findFirst({
        where: (p, { eq }) => eq(p.id, availableTimeOnDb.id),
      })
    expect(availableTime).toEqual(
      expect.objectContaining({
        weekday: 2,
        time: '12:00',
      }),
    )
  })
})
