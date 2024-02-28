import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { makeAppointment } from '@/test/factories/schedules/make-appointment'
import { InMemoryAppointmentsRepository } from '@/test/repositories/schedules/in-memory-appointments-repository'

import { MarkAppointmentAsScheduledUseCase } from './mark-appointment-as-scheduled'

describe('MarkAppointmentAsScheduledUseCase', () => {
  let useCase: MarkAppointmentAsScheduledUseCase
  let repository: InMemoryAppointmentsRepository

  beforeEach(() => {
    repository = new InMemoryAppointmentsRepository()
    useCase = new MarkAppointmentAsScheduledUseCase(repository)
  })

  it('should mark appointment as scheduled', async () => {
    const appointment = makeAppointment({ status: 'pending' })
    repository.appointments.push(appointment)

    const result = await useCase.execute({
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.appointments[0].status).toEqual('scheduled')
    expect(repository.appointments[0].id.equals(appointment.id)).toBeTruthy()
  })

  it('should return left if schedule operation is invalid', async () => {
    const appointment = makeAppointment({ status: 'finished' })
    repository.appointments.push(appointment)

    const result = await useCase.execute({
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new InvalidResource('This scheduled appointment could not be scheduled'),
    )
    expect(repository.appointments[0].status).toEqual('finished')
  })

  it('should return left if appointment not found', async () => {
    const result = await useCase.execute({
      scheduleAppointmentId: '123',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
