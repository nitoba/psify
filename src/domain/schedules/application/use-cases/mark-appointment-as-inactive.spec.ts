import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { makeAppointment } from '@/test/factories/schedules/make-appointment'
import { InMemoryAppointmentsRepository } from '@/test/repositories/schedules/in-memory-appointments-repository'

import { MarkAppointmentAsInactiveUseCase } from './mark-appointment-as-inactive'

describe('MarkAppointmentAsInactiveUseCase', () => {
  let useCase: MarkAppointmentAsInactiveUseCase
  let repository: InMemoryAppointmentsRepository

  beforeEach(() => {
    repository = new InMemoryAppointmentsRepository()
    useCase = new MarkAppointmentAsInactiveUseCase(repository)
  })

  it('should mark appointment as inactive', async () => {
    const appointment = makeAppointment({ status: 'canceled' })
    repository.appointments.push(appointment)

    const result = await useCase.execute({
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.appointments[0].status).toEqual('inactive')
    expect(repository.appointments[0].id.equals(appointment.id)).toBeTruthy()
  })

  it('should return left if status is pending', async () => {
    const appointment = makeAppointment({ status: 'pending' })
    repository.appointments.push(appointment)

    const result = await useCase.execute({
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new InvalidResource(
        'This scheduled appointment could not be inactivated',
      ),
    )
    expect(repository.appointments[0].status).toEqual('pending')
  })

  it('should return left if status is inactive', async () => {
    const appointment = makeAppointment({ status: 'inactive' })
    repository.appointments.push(appointment)

    const result = await useCase.execute({
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new InvalidResource(
        'This scheduled appointment could not be inactivated',
      ),
    )
    expect(repository.appointments[0].status).toEqual('inactive')
  })

  it('should return left if appointment not found', async () => {
    const result = await useCase.execute({
      scheduleAppointmentId: '123',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
