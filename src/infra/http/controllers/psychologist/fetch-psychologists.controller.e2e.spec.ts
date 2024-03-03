import fastifyCookie from '@fastify/cookie'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { RawServerDefault } from 'fastify'
import request from 'supertest'
import { AuthPsychologistFactory } from 'test/factories/auth/make-auth-psychologist'
import { makePatient } from 'test/factories/patient/make-patient'

import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { SpecialtyList } from '@/domain/psychologist/enterprise/entities/specialty-list'
import { Specialty } from '@/domain/psychologist/enterprise/value-objects/specialty'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch Available Times To Psychologists (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let authPsychologistFactory: AuthPsychologistFactory
  let encrypter: Encrypter

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

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test.only('[GET] /psychologists', async () => {
    const patient = makePatient()
    await authPsychologistFactory.makeDbPsychologist({
      name: Name.create('John Doe').value as Name,
      specialties: new SpecialtyList([
        Specialty.create('TCC').value as Specialty,
      ]),
    })

    const psychologist = await authPsychologistFactory.makeDbPsychologist({
      name: Name.create('Jane Don').value as Name,
      specialties: new SpecialtyList([
        Specialty.create('Psychoanalysis').value as Specialty,
      ]),
    })

    const token = await encrypter.encrypt({
      sub: patient.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/psychologists')
      .set('Cookie', [`psify@access_token=${token}`])
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.psychologists).toHaveLength(2)
    expect(response.body).toEqual(
      expect.objectContaining({
        psychologists: expect.arrayContaining([
          expect.objectContaining({
            id: psychologist.id.toString(),
            name: psychologist.name,
            email: psychologist.email,
            phone: psychologist.phone,
            specialties: psychologist.specialties,
            consultationPriceInCents: psychologist.consultationPriceInCents,
          }),
        ]),
      }),
    )

    const responseWithName = await request(app.getHttpServer())
      .get(`/psychologists?name=Jane`)
      .set('Cookie', [`psify@access_token=${token}`])
      .send()

    expect(responseWithName.body.psychologists).toHaveLength(1)
    expect(responseWithName.statusCode).toBe(200)
    expect(responseWithName.body.psychologists[0].name).toBe('Jane Don')

    const responseWithSpecialties = await request(app.getHttpServer())
      .get(`/psychologists?name=Jane&specialties=Psychoanalysis,TCC`)
      .set('Cookie', [`psify@access_token=${token}`])
      .send()

    expect(responseWithSpecialties.body.psychologists).toHaveLength(1)
    expect(responseWithSpecialties.statusCode).toBe(200)
    expect(responseWithSpecialties.body.psychologists[0].name).toBe('Jane Don')
  })
})
