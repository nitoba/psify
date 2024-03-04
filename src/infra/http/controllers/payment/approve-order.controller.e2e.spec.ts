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
import { OrderFactory } from 'test/factories/payment/make-order'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'
import { OrderItem } from '@/domain/payment/enterprise/entities/order-item'
import { AppModule } from '@/infra/app.module'
import { Role } from '@/infra/auth/roles'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'

describe('Approve Order Controller (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let authPsychologistFactory: AuthPsychologistFactory
  let authPatientFactory: AuthPatientFactory
  let orderFactory: OrderFactory
  let encrypter: Encrypter
  let drizzleService: DrizzleService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AuthPsychologistFactory, AuthPatientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    app.register(fastifyCookie)
    authPsychologistFactory = moduleRef.get(AuthPsychologistFactory)
    encrypter = moduleRef.get(Encrypter)
    drizzleService = moduleRef.get(DrizzleService)
    orderFactory = moduleRef.get(OrderFactory)
    authPatientFactory = moduleRef.get(AuthPatientFactory)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /orders/:orderId/approve', async () => {
    const psychologist = await authPsychologistFactory.makeDbPsychologist()
    const patient = await authPatientFactory.makeDbPatient()
    const orderId = new UniqueEntityID()
    const orderOnDb = await orderFactory.makeDbOrder(
      {
        costumerId: new UniqueEntityID(patient.id),
        sellerId: new UniqueEntityID(psychologist.id),
        orderItems: [
          OrderItem.create({
            name: 'Item 1',
            itemId: new UniqueEntityID(),
            orderId,
            quantity: 1,
            priceInCents: 1000,
          }),
        ],
      },
      orderId,
    )

    expect(orderOnDb.status).toBe('pending')

    const token = await encrypter.encrypt({
      sub: psychologist.id.toString(),
      role: Role.Psychologist,
    })

    const response = await request(app.getHttpServer())
      .put(`/orders/${orderId}/approve`)
      .set('Cookie', [`psify@access_token=${token}`])
      .send()

    expect(response.status).toBe(200)
    const orderOnDbAfterApprove =
      await drizzleService.client.query.orders.findFirst({
        where: ({ id }, { eq }) => eq(id, orderId.toString()),
      })

    expect(orderOnDbAfterApprove?.status).toBe('approved')
  })
})
