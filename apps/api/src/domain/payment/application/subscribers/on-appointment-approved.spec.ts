import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from 'test/utils/wait-for'

import { CreateIntentOrderUseCase } from '../use-cases/create-intent-order'
import { OnAppointmentApprovedHandler } from './on-appointment-approved'

describe('On Appointment Approved Handler', () => {
  let createIntentOrderUseCase: CreateIntentOrderUseCase
  let appointmentRepository: InMemoryAppointmentsRepository
  let orderRepository: InMemoryOrderRepository

  beforeEach(() => {
    appointmentRepository = new InMemoryAppointmentsRepository()
    orderRepository = new InMemoryOrderRepository()
    createIntentOrderUseCase = new CreateIntentOrderUseCase(orderRepository)

    // eslint-disable-next-line no-new
    new OnAppointmentApprovedHandler(
      createIntentOrderUseCase,
      appointmentRepository,
      orderRepository,
    )
  })

  it('should create order when appointment was approved', async () => {
    const createIntentOrderUseCaseSpy = vi.spyOn(
      createIntentOrderUseCase,
      'execute',
    )
    const appointment = makeAppointment()
    appointmentRepository.appointments.push(appointment)

    appointment.approve()

    appointmentRepository.save(appointment)

    await waitFor(() => {
      expect(createIntentOrderUseCaseSpy).toHaveBeenCalled()
      expect(orderRepository.orders[0].status).toBe('pending')
    })
  })
})
