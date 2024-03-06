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

import { MarkAppointmentAsScheduledUseCase } from '../use-cases/mark-appointment-as-scheduled'
import { OnOrderApproved } from './on-order-approved'
let orderRepository: InMemoryOrderRepository
let markAsScheduledUseCase: MarkAppointmentAsScheduledUseCase
let appointmentsRepository: InMemoryAppointmentsRepository
describe('On Order Approved', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    appointmentsRepository = new InMemoryAppointmentsRepository()
    markAsScheduledUseCase = new MarkAppointmentAsScheduledUseCase(
      appointmentsRepository,
    )
    new OnOrderApproved(markAsScheduledUseCase)
  })

  it('should mark appointment as scheduled when order approved', async () => {
    const markAsScheduledUseCaseSpy = vi.spyOn(
      markAsScheduledUseCase,
      'execute',
    )
    const psychologist = makePsychologist()
    const patient = makePatient()
    const appointment = makeAppointment({
      patientId: patient.id,
      psychologistId: psychologist.id,
      status: 'approved',
    })
    appointmentsRepository.appointments.push(appointment)

    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
        status: 'pending',
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

    order.approve()

    orderRepository.save(order)

    await waitFor(() => {
      expect(markAsScheduledUseCaseSpy).toHaveBeenCalled()
    })
    expect(appointmentsRepository.appointments[0].status).toEqual('scheduled')
  })
})
