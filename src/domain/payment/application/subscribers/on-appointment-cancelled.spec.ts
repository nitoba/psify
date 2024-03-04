import { makeOrder } from 'test/factories/payment/make-order'
import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from 'test/utils/wait-for'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { OrderItem } from '../../enterprise/entities/order-item'
import { CancelOrderUseCase } from '../use-cases/cancel-order'
import { OnAppointmentCancelledHandler } from './on-appointment-cancelled'

describe('On Appointment Cancelled Handler', () => {
  let cancelOrderUseCase: CancelOrderUseCase
  let appointmentRepository: InMemoryAppointmentsRepository
  let orderRepository: InMemoryOrderRepository

  beforeEach(() => {
    appointmentRepository = new InMemoryAppointmentsRepository()
    orderRepository = new InMemoryOrderRepository()
    cancelOrderUseCase = new CancelOrderUseCase(orderRepository)

    // eslint-disable-next-line no-new
    new OnAppointmentCancelledHandler(
      cancelOrderUseCase,
      appointmentRepository,
      orderRepository,
    )
  })

  it('should create order when appointment is requested', async () => {
    const cancelOrderUseCaseSpy = vi.spyOn(cancelOrderUseCase, 'execute')
    const appointment = makeAppointment()
    appointmentRepository.create(appointment)

    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
        costumerId: appointment.patientId,
        sellerId: appointment.psychologistId,
        orderItems: [
          OrderItem.create({
            itemId: appointment.id,
            name: 'Appointment',
            orderId,
            priceInCents: 1000,
            quantity: 1,
          }),
        ],
      },
      orderId,
    )
    orderRepository.orders.push(order)

    order.cancel()

    await waitFor(() => {
      expect(cancelOrderUseCaseSpy).toHaveBeenCalled()
    })
    expect(orderRepository.orders[0].status).toBe('canceled')
    // expect(appointmentRepository.appointments[0].status).toBe('inactive')
  })
})
