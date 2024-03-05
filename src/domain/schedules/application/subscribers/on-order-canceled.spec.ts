/* eslint-disable no-new */
import { makePatient } from 'test/factories/patient/make-patient'
import { makeOrder } from 'test/factories/payment/make-order'
import { makePsychologist } from 'test/factories/psychologist/make-psychologist'
import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from 'test/utils/wait-for'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/payment/enterprise/entities/order-item'

import { MarkAppointmentAsInactiveUseCase } from '../use-cases/mark-appointment-as-inactive'
import { OnOrderCanceled } from './on-order-canceled'

let markAsInactiveUseCase: MarkAppointmentAsInactiveUseCase
let appointmentsRepository: InMemoryAppointmentsRepository
let orderRepository: InMemoryOrderRepository
describe('On Order Rejected', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    appointmentsRepository = new InMemoryAppointmentsRepository()
    markAsInactiveUseCase = new MarkAppointmentAsInactiveUseCase(
      appointmentsRepository,
    )
    new OnOrderCanceled(markAsInactiveUseCase)
  })

  it('should mark appointment as inactive when order canceled', async () => {
    const markAsInactiveUseCaseSpy = vi.spyOn(markAsInactiveUseCase, 'execute')
    const psychologist = makePsychologist()
    const patient = makePatient()
    const appointment = makeAppointment({
      patientId: patient.id,
      psychologistId: psychologist.id,
      status: 'pending',
    })
    appointmentsRepository.appointments.push(appointment)

    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
        orderItems: [
          OrderItem.create({
            itemId: appointment.id,
            name: 'Appointment',
            orderId,
            quantity: 1,
            priceInCents: psychologist.consultationPriceInCents,
          }),
        ],
      },
      orderId,
    )

    order.cancel()

    orderRepository.save(order)

    await waitFor(() => {
      expect(markAsInactiveUseCaseSpy).toHaveBeenCalled()
    })
    // expect(appointmentsRepository.appointments[0].status).toEqual('inactive')
  })
})
