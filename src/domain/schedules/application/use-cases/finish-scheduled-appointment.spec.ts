import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { FinishScheduledAppointmentUseCase } from './finish-scheduled-appointment'

describe('FinishScheduledAppointmentUseCase', () => {
  let useCase: FinishScheduledAppointmentUseCase
  let repository: InMemoryAppointmentsRepository

  beforeEach(() => {
    repository = new InMemoryAppointmentsRepository()
    useCase = new FinishScheduledAppointmentUseCase(repository)
  })

  it('should finish a appointment', async () => {
    const appointment = makeAppointment()

    repository.appointments.push(appointment)

    const result = await useCase.execute({
      scheduledAppointmentId: appointment.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.appointments).toHaveLength(1)
    expect(repository.appointments[0].status).toEqual('finished')
  })

  it('should return left if appointment not found', async () => {
    const result = await useCase.execute({
      scheduledAppointmentId: '456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if appointment status is not canceled or finished', async () => {
    const appointment = makeAppointment({
      status: 'finished',
    })

    const appointment2 = makeAppointment({
      status: 'canceled',
    })

    repository.appointments.push(appointment, appointment2)

    const result = await useCase.execute({
      scheduledAppointmentId: appointment.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)

    const result2 = await useCase.execute({
      scheduledAppointmentId: appointment2.id.toString(),
    })

    expect(result2.isLeft()).toBeTruthy()
    expect(result2.value).toBeInstanceOf(InvalidResource)
  })
})
