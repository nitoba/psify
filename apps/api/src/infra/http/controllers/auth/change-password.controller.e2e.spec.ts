import fastifyCookie from '@fastify/cookie'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { RawServerDefault } from 'fastify'
import request from 'supertest'
import { AuthPatientFactory } from 'test/factories/auth/make-auth-patient'
import { AuthPsychologistFactory } from 'test/factories/auth/make-auth-psychologist'

import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'
import { HashComparer } from '@/domain/auth/application/cryptography/hash-comparer'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'

describe('Change Password (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let authPsychologistFactory: AuthPsychologistFactory
  let authPatientFactory: AuthPatientFactory
  let drizzleService: DrizzleService
  let hasher: HashComparer

  let encrypter: Encrypter

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
    drizzleService = moduleRef.get(DrizzleService)
    hasher = moduleRef.get(HashComparer)
    encrypter = moduleRef.get(Encrypter)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /auth/change-password', async () => {
    const psychologist = await authPsychologistFactory.makeDbPsychologist({
      password: '123456',
    })
    const patient = await authPatientFactory.makeDbPatient({
      password: '123456',
    })

    let token = await encrypter.encrypt({
      sub: psychologist.id,
      role: 'psychologist',
    })

    let response = await request(app.getHttpServer())
      .post(`/auth/change-password`)
      .set('Cookie', [`psify@access_token=${token}`])
      .send({ oldPassword: '123456', newPassword: 'new-password' })

    expect(response.statusCode).toBe(200)
    let passwordOnDB = await drizzleService.client.query.psychologist.findFirst(
      {
        columns: { password: true },
        where: ({ id }, { eq }) => eq(id, psychologist.id),
      },
    )

    let passwordMatch = await hasher.compare(
      'new-password',
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      passwordOnDB?.password!,
    )

    expect(passwordMatch).toBe(true)

    token = await encrypter.encrypt({
      sub: patient.id,
      role: 'patient',
    })

    response = await request(app.getHttpServer())
      .post(`/auth/change-password`)
      .set('Cookie', [`psify@access_token=${token}`])
      .send({ oldPassword: '123456', newPassword: 'new-password' })

    expect(response.statusCode).toBe(200)

    passwordOnDB = await drizzleService.client.query.patient.findFirst({
      columns: { password: true },
      where: ({ id }, { eq }) => eq(id, patient.id),
    })

    passwordMatch = await hasher.compare(
      'new-password',
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      passwordOnDB?.password!,
    )

    expect(passwordMatch).toBe(true)
  })
})
