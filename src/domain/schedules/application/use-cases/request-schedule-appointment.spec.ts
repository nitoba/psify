import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AvailableTime } from '@/domain/psychologist/enterprise/entities/available-time'
import { AvailableTimesList } from '@/domain/psychologist/enterprise/entities/available-times-list'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'
import { makePatient } from '@/test/factories/patient/make-patient'
import { makeAvailableTime } from '@/test/factories/psychologist/make-available-times'
import { makePsychologist } from '@/test/factories/psychologist/make-psychologist'
import { makeAppointment } from '@/test/factories/schedules/make-appointment'
import { InMemoryPatientRepository } from '@/test/repositories/patient/in-memory-patient-repository'
import { InMemoryPsychologistRepository } from '@/test/repositories/psychologist/in-memory-psychologist-repository'
import { InMemoryAppointmentsRepository } from '@/test/repositories/schedules/in-memory-appointments-repository'

import { Appointment } from '../../enterprise/entities/appointment'
import { RequestScheduleAppointmentUseCase } from './request-schedule-appointment'

describe('RequestScheduleAppointmentUseCase', () => {
  let useCase: RequestScheduleAppointmentUseCase
  let patientRepository: InMemoryPatientRepository
  let psychologistRepository: InMemoryPsychologistRepository
  let appointmentRepository: InMemoryAppointmentsRepository

  beforeEach(() => {
    patientRepository = new InMemoryPatientRepository()
    psychologistRepository = new InMemoryPsychologistRepository()
    appointmentRepository = new InMemoryAppointmentsRepository()

    useCase = new RequestScheduleAppointmentUseCase(
      patientRepository,
      psychologistRepository,
      appointmentRepository,
    )
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should return left if psychologist is not found', async () => {
    const psychologistId = '456'
    const scheduledTo = new Date()

    const patient = makePatient()

    patientRepository.create(patient)

    const result = await useCase.execute({
      patientId: patient.id.toString(),
      psychologistId,
      scheduledTo,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if patient is not found', async () => {
    const patientId = '123'
    const scheduledTo = new Date()
    const psychologist = makePsychologist()

    psychologistRepository.create(psychologist)

    const result = await useCase.execute({
      patientId,
      psychologistId: psychologist.id.toString(),
      scheduledTo,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if patient is already scheduled', async () => {
    const patientId = new UniqueEntityID()
    const psychologistId = new UniqueEntityID()
    const scheduledTo = new Date()

    const patient = makePatient(
      {
        scheduledAppointments: [
          makeAppointment({
            patientId,
            psychologistId,
            status: 'scheduled',
          }),
        ],
      },
      patientId,
    )

    const psychologist = makePsychologist(
      {
        availableTimes: new AvailableTimesList([
          makeAvailableTime({}, psychologistId),
        ]),
      },
      psychologistId,
    )

    await patientRepository.create(patient)
    await psychologistRepository.create(psychologist)

    const result = await useCase.execute({
      patientId: patientId.toString(),
      psychologistId: psychologistId.toString(),
      scheduledTo,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)
  })

  it('should return left if psychologist is not available', async () => {
    vi.useFakeTimers().setSystemTime(new Date(2024, 1, 25, 8))
    const patientId = new UniqueEntityID()
    const scheduledTo = new Date(2024, 1, 25, 9)
    const psychologistId = new UniqueEntityID()
    const availableTimes = [
      AvailableTime.create({
        psychologistId,
        weekday: 0,
        time: Time.create('09:00').value as Time,
      }),
      AvailableTime.create({
        psychologistId,
        weekday: 1,
        time: Time.create('12:00').value as Time,
      }),
    ]
    const psychologist = makePsychologist(
      {
        scheduledAppointments: [
          Appointment.create({
            patientId: new UniqueEntityID(),
            psychologistId,
            scheduledTo,
          }),
        ],
        availableTimes: new AvailableTimesList(availableTimes),
      },
      psychologistId,
    )

    const patient = makePatient({}, patientId)

    psychologistRepository.create(psychologist)
    patientRepository.create(patient)

    const result = await useCase.execute({
      patientId: patientId.toString(),
      psychologistId: psychologistId.toString(),
      scheduledTo,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)
  })

  it('should create a new appointment', async () => {
    vi.useFakeTimers().setSystemTime(new Date(2024, 1, 25, 8))
    const patientId = new UniqueEntityID()
    const scheduledTo = new Date(2024, 1, 25, 12)
    const psychologistId = new UniqueEntityID()
    const availableTimes = [
      AvailableTime.create({
        psychologistId,
        weekday: 0,
        time: Time.create('09:00').value as Time,
      }),
      AvailableTime.create({
        psychologistId,
        weekday: 0,
        time: Time.create('12:00').value as Time,
      }),
    ]
    const psychologist = makePsychologist(
      {
        scheduledAppointments: [
          Appointment.create({
            patientId: new UniqueEntityID(),
            psychologistId,
            scheduledTo: new Date(2024, 1, 25, 9),
          }),
        ],
        availableTimes: new AvailableTimesList(availableTimes),
      },
      psychologistId,
    )

    const patient = makePatient({}, patientId)

    psychologistRepository.create(psychologist)
    patientRepository.create(patient)

    const result = await useCase.execute({
      patientId: patientId.toString(),
      psychologistId: psychologistId.toString(),
      scheduledTo,
    })

    expect(result.isRight()).toBeTruthy()
    expect(appointmentRepository.appointments[0].status).toEqual('pending')
    expect(appointmentRepository.appointments[0].patientId).toEqual(patientId)
    expect(appointmentRepository.appointments[0].psychologistId).toEqual(
      psychologistId,
    )
  })
})
