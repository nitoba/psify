import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { makeAppointment } from '@/test/factories/schedules/make-appointment'
import { InMemoryAppointmentsRepository } from '@/test/repositories/schedules/in-memory-appointments-repository'

import { FinishScheduledAppointmentUsecase } from './finish-scheduled-appointment'

describe('FinishScheduledAppointmentUsecase', () => {
  let useCase: FinishScheduledAppointmentUsecase
  let repository: InMemoryAppointmentsRepository

  beforeEach(() => {
    repository = new InMemoryAppointmentsRepository()
    useCase = new FinishScheduledAppointmentUsecase(repository)
  })

  it('should finish a appointment', async () => {
    const appointment = makeAppointment()

    repository.appointments.push(appointment)

    const result = await useCase.execute({
      psychologistId: appointment.psychologistId.toString(),
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.appointments).toHaveLength(1)
    expect(repository.appointments[0].status).toEqual('finished')
  })

  it('should return left if appointment not found', async () => {
    const result = await useCase.execute({
      psychologistId: '123',
      scheduleAppointmentId: '456',
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
      psychologistId: appointment.psychologistId.toString(),
      scheduleAppointmentId: appointment.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)

    const result2 = await useCase.execute({
      psychologistId: appointment2.psychologistId.toString(),
      scheduleAppointmentId: appointment2.id.toString(),
    })

    expect(result2.isLeft()).toBeTruthy()
    expect(result2.value).toBeInstanceOf(InvalidResource)
  })
})
