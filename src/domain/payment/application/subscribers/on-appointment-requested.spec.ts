import { makeAppointment } from '@/test/factories/schedules/make-appointment'
import { InMemoryOrderRepository } from '@/test/repositories/payment/in-memory-order-repository'
import { InMemoryAppointmentsRepository } from '@/test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from '@/test/utils/wait-for'

import { CreateIntentOrderUseCase } from '../use-cases/create-intent-order'
import { OnAppointmentCreatedHandler } from './on-appointment-requested'

describe('On Appointment Requested Handler', () => {
  let createOrderUseCase: CreateIntentOrderUseCase
  let appointmentRepository: InMemoryAppointmentsRepository
  let orderRepository: InMemoryOrderRepository

  beforeEach(() => {
    appointmentRepository = new InMemoryAppointmentsRepository()
    orderRepository = new InMemoryOrderRepository()
    createOrderUseCase = new CreateIntentOrderUseCase(orderRepository)

    // eslint-disable-next-line no-new
    new OnAppointmentCreatedHandler(
      createOrderUseCase,
      appointmentRepository,
      orderRepository,
    )
  })

  it('should create order when appointment is requested', async () => {
    const createOrderUseCaseSpy = vi.spyOn(createOrderUseCase, 'execute')
    const appointment = makeAppointment()
    expect(appointment.domainEvents).toHaveLength(1)
    appointmentRepository.create(appointment)
    expect(appointment.domainEvents).toHaveLength(0)

    await waitFor(() => {
      expect(createOrderUseCaseSpy).toHaveBeenCalled()
    })
    expect(orderRepository.orders).toHaveLength(1)
  })
})
