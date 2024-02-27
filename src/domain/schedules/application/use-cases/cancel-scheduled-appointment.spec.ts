import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { makeAppointment } from '@/test/factories/schedules/make-appointment'
import { InMemoryAppointmentsRepository } from '@/test/repositories/schedules/in-memory-appointments-repository'

import { CancelScheduledAppointmentUseCase } from './cancel-scheduled-appointment'

describe('CancelScheduledAppointmentUseCaseRequest', () => {
  let useCase: CancelScheduledAppointmentUseCase
  let repository: InMemoryAppointmentsRepository

  beforeEach(() => {
    repository = new InMemoryAppointmentsRepository()
    useCase = new CancelScheduledAppointmentUseCase(repository)
  })

  it('should cancel a confirmed appointment', async () => {
    const appointment = makeAppointment()

    repository.appointments.push(appointment)

    const result = await useCase.execute({
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.appointments).toHaveLength(1)
    expect(repository.appointments[0].status).toEqual('canceled')
  })

  it('should return left if appointment not found', async () => {
    const result = await useCase.execute({
      scheduleAppointmentId: '456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if appointment status is not confirmed', async () => {
    const appointment = makeAppointment({
      status: 'finished',
    })

    repository.appointments.push(appointment)

    const result = await useCase.execute({
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)
  })
})
