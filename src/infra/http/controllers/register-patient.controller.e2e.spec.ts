import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { RawServerDefault } from 'fastify'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'
describe('Register Patient (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let drizzleService: DrizzleService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    drizzleService = moduleRef.get(DrizzleService)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(() => {
    app.close()
  })

  test('[POST] /auth/patients/register', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/patients/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '(88) 912345678',
        password: '123456',
      })
    expect(response.statusCode).toBe(201)
    const patientOnDatabase =
      await drizzleService.client.query.patient.findFirst({
        columns: {
          email: true,
        },
        where: (p, { eq }) => eq(p.email, 'johndoe@example.com'),
      })
    expect(patientOnDatabase).toBeTruthy()
  })
})
