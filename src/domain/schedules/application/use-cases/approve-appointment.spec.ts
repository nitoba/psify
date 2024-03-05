import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { ApproveAppointmentUseCase } from './approve-appointment'

describe('ApproveAppointmentUseCaseRequest', () => {
  let useCase: ApproveAppointmentUseCase
  let repository: InMemoryAppointmentsRepository

  beforeEach(() => {
    repository = new InMemoryAppointmentsRepository()
    useCase = new ApproveAppointmentUseCase(repository)
  })

  it('should approve a appointment', async () => {
    const appointment = makeAppointment()

    repository.appointments.push(appointment)

    const result = await useCase.execute({
      appointmentId: appointment.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.appointments).toHaveLength(1)
    expect(repository.appointments[0].status).toEqual('approved')
  })

  it('should return left if appointment not found', async () => {
    const result = await useCase.execute({
      appointmentId: '456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to approve appointment', async () => {
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
