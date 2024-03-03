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
// import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { DatabaseModule } from '@/infra/database/database.module'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'

describe('Update Specialties From Psychologists (E2E)', () => {
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

  test('[PUT] /psychologists/specialties', async () => {
    const psychologist = await authPsychologistFactory.makeDbPsychologist()

    const token = await encrypter.encrypt({
      sub: psychologist.id.toString(),
      role: 'psychologist',
    })

    let response = await request(app.getHttpServer())
      .put('/psychologists/specialties')
      .set('Cookie', [`psify@access_token=${token}`])
      .send({
        adds: ['tcc', 'psicanalise'],
      })
    expect(response.statusCode).toBe(204)

    let psychologistOnDatabase =
      await drizzleService.client.query.psychologist.findFirst({
        columns: {
          specialties: true,
        },
        where: (p, { eq }) => eq(p.id, psychologist.id.toString()),
      })

    expect(psychologistOnDatabase?.specialties).toEqual(['tcc', 'psicanalise'])

    response = await request(app.getHttpServer())
      .put('/psychologists/specialties')
      .set('Cookie', [`psify@access_token=${token}`])
      .send({
        removes: ['tcc'],
      })
    expect(response.statusCode).toBe(204)
    psychologistOnDatabase =
      await drizzleService.client.query.psychologist.findFirst({
        columns: {
          specialties: true,
        },
        where: (p, { eq }) => eq(p.id, psychologist.id.toString()),
      })
    expect(psychologistOnDatabase?.specialties).toEqual(['psicanalise'])
  })
})
