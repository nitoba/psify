import { addDays } from 'date-fns'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { makePatient } from '@/test/factories/patient/make-patient'
import { makeAppointment } from '@/test/factories/schedules/make-appointment'
import { InMemoryPatientRepository } from '@/test/repositories/patient/in-memory-patient-repository'
import { InMemoryAppointmentsRepository } from '@/test/repositories/schedules/in-memory-appointments-repository'

import { FetchScheduledAppointmentsFromPatientUseCase } from './fetch-scheduled-appointments-from-patient'

let useCase: FetchScheduledAppointmentsFromPatientUseCase
let patientRepository: InMemoryPatientRepository
let appointmentsRepository: InMemoryAppointmentsRepository

describe('FetchScheduledAppointmentsFromPatientUseCase', () => {
  beforeEach(() => {
    patientRepository = new InMemoryPatientRepository()
    appointmentsRepository = new InMemoryAppointmentsRepository()
    useCase = new FetchScheduledAppointmentsFromPatientUseCase(
      patientRepository,
      appointmentsRepository,
    )
    vi.useFakeTimers({
      now: new Date(),
    })
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('should return scheduled appointments for valid patient', async () => {
    const patient = makePatient()
    patientRepository.patients.push(patient)

    const appointment1 = makeAppointment({ patientId: patient.id })
    const appointment2 = makeAppointment({ patientId: patient.id })

    appointmentsRepository.appointments.push(appointment1, appointment2)

    const result = await useCase.execute({
      patientId: patient.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.scheduledAppointments).toEqual([
        appointment1,
        appointment2,
      ])
    }
  })

  it('should return scheduled appointments for valid patient paginated', async () => {
    const patient = makePatient()
    patientRepository.patients.push(patient)

    for (let i = 0; i < 12; i++) {
      const appointment = makeAppointment({ patientId: patient.id })
      appointmentsRepository.appointments.push(appointment)
    }

    const result = await useCase.execute({
      patientId: patient.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.scheduledAppointments).toHaveLength(2)
    }
  })

  it('should filter appointments by period when is valid period', async () => {
    const date = new Date(2024, 3, 10, 13)
    vi.setSystemTime(date)
    const patient = makePatient()
    patientRepository.patients.push(patient)

    const appointment1 = makeAppointment({
      patientId: patient.id,
      scheduledTo: new Date('03-12-2024'),
    })
    const appointment2 = makeAppointment({
      patientId: patient.id,
      scheduledTo: addDays(new Date('03-12-2024'), 15),
    })

    appointmentsRepository.appointments.push(appointment1, appointment2)

    const result = await useCase.execute({
      patientId: patient.id.toString(),
      page: 1,
      period: {
        from: new Date('03-10-2024'),
        to: new Date('03-17-2024'),
      },
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.scheduledAppointments).toHaveLength(1)
    }
  })

  it('should return left with invalid period error for invalid period', async () => {
    const patient = makePatient()
    patientRepository.patients.push(patient)

    const result = await useCase.execute({
      patientId: patient.id.toString(),
      page: 1,
      period: {
        from: new Date('03-10-2024'),
        to: new Date('03-26-2024'),
      },
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should return left with not found error if invalid patient', async () => {
    const result = await useCase.execute({
      patientId: 'invalid',
      page: 1,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})

describe('FetchScheduledAppointmentsFromPatientUseCase filter status', () => {
  beforeEach(() => {
    patientRepository = new InMemoryPatientRepository()
    appointmentsRepository = new InMemoryAppointmentsRepository()
    useCase = new FetchScheduledAppointmentsFromPatientUseCase(
      patientRepository,
      appointmentsRepository,
    )
  })
  it('should filter scheduled appointments by status finished', async () => {
    const patient = makePatient()
    const finishedAppointment = makeAppointment({
      status: 'finished',
      patientId: patient.id,
    })
    const appointment = makeAppointment({ patientId: patient.id })

    patientRepository.patients.push(patient)
    appointmentsRepository.appointments = [finishedAppointment, appointment]

    const result = await useCase.execute({
      patientId: patient.id.toString(),
      status: 'finished',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.scheduledAppointments).toHaveLength(1)
    }
  })

  it('should return empty list if no appointments match filter', async () => {
    const patient = makePatient()
    const finishedAppointment = makeAppointment({
      status: 'canceled',
      patientId: patient.id,
    })
    const appointment = makeAppointment({ patientId: patient.id })

    patientRepository.patients.push(patient)
    appointmentsRepository.appointments = [finishedAppointment, appointment]

    const result = await useCase.execute({
      patientId: patient.id.toString(),
      status: 'finished',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.scheduledAppointments).toHaveLength(0)
    }
  })
})
