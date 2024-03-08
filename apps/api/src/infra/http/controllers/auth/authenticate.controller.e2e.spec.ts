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
import { AuthPatientFactory } from 'test/factories/auth/make-auth-patient'
describe('Authenticate Psychologist or Patient (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let authPsychologistFactory: AuthPsychologistFactory
  let authPatientFactory: AuthPatientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AuthPsychologistFactory, AuthPatientFactory],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    app.register(fastifyCookie)
    authPsychologistFactory = moduleRef.get(AuthPsychologistFactory)
    authPatientFactory = moduleRef.get(AuthPatientFactory)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /auth/authenticate', async () => {
    await authPsychologistFactory.makeDbPsychologist({
      email: Email.create('psy@example.com').value as Email,
      password: '123456',
    })

    await authPatientFactory.makeDbPatient({
      email: Email.create('patient@example.com').value as Email,
      password: '123456',
    })

    let response = await request(app.getHttpServer())
      .post('/auth/authenticate')
      .send({
        email: 'psy@example.com',
        password: '123456',
      })
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
    expect(response.headers['set-cookie'][0].includes('psify@access_token'))
    expect(response.headers['set-cookie'][0].includes('psify@refresh_token'))

    response = await request(app.getHttpServer())
      .post('/auth/authenticate')
      .send({
        email: 'patient@example.com',
        password: '123456',
      })
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
    expect(response.headers['set-cookie'][0].includes('psify@access_token'))
    expect(response.headers['set-cookie'][0].includes('psify@refresh_token'))
  })
})
