import fastifyCookie from '@fastify/cookie'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { RawServerDefault } from 'fastify'
import request from 'supertest'
import { AuthPsychologistFactory } from 'test/factories/auth/make-auth-psychologist'

import { Email } from '@/domain/core/enterprise/value-objects/email'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
describe('Authenticate Psychologist (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let authPsychologistFactory: AuthPsychologistFactory

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

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /auth/psychologists/authenticate', async () => {
    await authPsychologistFactory.makeDbPsychologist({
      email: Email.create('johndoe@example.com').value as Email,
      password: '123456',
    })

    const response = await request(app.getHttpServer())
      .post('/auth/psychologists/authenticate')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
    expect(response.headers['set-cookie'][0].includes('psify@access_token'))
  })
})
