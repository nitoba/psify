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
import { AppointmentFactory } from 'test/factories/schedules/make-appointment'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'
import { AppModule } from '@/infra/app.module'
import { Role } from '@/infra/auth/roles'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'

describe('Approve Appointment Controller (E2E)', () => {
  let app: NestFastifyApplication<RawServerDefault>
  let authPsychologistFactory: AuthPsychologistFactory
  let authPatientFactory: AuthPatientFactory
  let appointmentFactory: AppointmentFactory
  let encrypter: Encrypter
  let drizzleService: DrizzleService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        AuthPsychologistFactory,
        AuthPatientFactory,
        AppointmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    app.register(fastifyCookie)
    authPsychologistFactory = moduleRef.get(AuthPsychologistFactory)
    encrypter = moduleRef.get(Encrypter)
    drizzleService = moduleRef.get(DrizzleService)
    appointmentFactory = moduleRef.get(AppointmentFactory)
    authPatientFactory = moduleRef.get(AuthPatientFactory)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /schedules/appointments/:appointmentId/approve', async () => {
    const psychologist = await authPsychologistFactory.makeDbPsychologist()
    const patient = await authPatientFactory.makeDbPatient()
    const appointmentId = new UniqueEntityID()
    const appointmentOnDb = await appointmentFactory.makeDbAppointment(
      {
        costInCents: psychologist.consultationPriceInCents!,
        patientId: new UniqueEntityID(patient.id),
        psychologistId: new UniqueEntityID(psychologist.id),
        scheduledTo: new Date(),
        status: 'pending',
      },
      appointmentId,
    )

    expect(appointmentOnDb.status).toBe('pending')

    const token = await encrypter.encrypt({
      sub: psychologist.id.toString(),
      role: Role.Psychologist,
    })

    const response = await request(app.getHttpServer())
      .put(`/schedules/appointments/${appointmentId}/approve`)
      .set('Cookie', [`psify@access_token=${token}`])
      .send()

    expect(response.status).toBe(200)
    const appointmentOnDbAfterApprove =
      await drizzleService.client.query.appointments.findFirst({
        where: ({ id }, { eq }) => eq(id, appointmentId.toString()),
      })

    expect(appointmentOnDbAfterApprove?.status).toBe('approved')
  })
})
