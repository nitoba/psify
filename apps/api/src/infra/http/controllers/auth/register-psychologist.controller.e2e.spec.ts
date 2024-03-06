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
describe('Register Psychologist (E2E)', () => {
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

  test('[POST] /auth/psychologists/register', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/psychologists/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '(88) 912345678',
        password: '123456',
        crp: '1234567',
      })
    expect(response.statusCode).toBe(201)
    const psychologistOnDatabase =
      await drizzleService.client.query.psychologist.findFirst({
        columns: {
          email: true,
        },
        where: (p, { eq }) => eq(p.email, 'johndoe@example.com'),
      })
    expect(psychologistOnDatabase).toBeTruthy()
  })
})
