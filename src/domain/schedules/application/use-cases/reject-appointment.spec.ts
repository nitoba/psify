import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { RejectAppointmentUseCase } from './reject-appointment'

describe('RejectAppointmentUseCaseRequest', () => {
  let useCase: RejectAppointmentUseCase
  let repository: InMemoryAppointmentsRepository

  beforeEach(() => {
    repository = new InMemoryAppointmentsRepository()
    useCase = new RejectAppointmentUseCase(repository)
  })

  it('should reject a appointment', async () => {
    const appointment = makeAppointment()

    repository.appointments.push(appointment)

    const result = await useCase.execute({
      appointmentId: appointment.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.appointments).toHaveLength(1)
    expect(repository.appointments[0].status).toEqual('rejected')
  })

  it('should return left if appointment not found', async () => {
    const result = await useCase.execute({
      appointmentId: '456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to reject appointment', async () => {
    const appointment = makeAppointment({
      status: 'finished',
    })

    repository.appointments.push(appointment)

    const result = await useCase.execute({
      appointmentId: appointment.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)
  })
})
