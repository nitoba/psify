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

describe('Add Available Times To Psychologists (E2E)', () => {
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

  test('[POST] /psychologists/available-times', async () => {
    const psychologist = await authPsychologistFactory.makeDbPsychologist()

    const token = await encrypter.encrypt({
      sub: psychologist.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .post('/psychologists/available-times')
      .set('Cookie', [`psify@access_token=${token}`])
      .send({
        availableTimes: [
          {
            weekday: 1,
            time: '12:00',
          },
        ],
      })

    expect(response.statusCode).toBe(201)

    const availableTime =
      await drizzleService.client.query.availableTimes.findFirst({
        where: (p, { eq }) => eq(p.psychologistId, psychologist.id.toString()),
      })

    expect(availableTime).toEqual(
      expect.objectContaining({
        weekday: 1,
        time: '12:00',
      }),
    )
  })
})
