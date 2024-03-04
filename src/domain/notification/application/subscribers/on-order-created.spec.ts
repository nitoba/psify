/* eslint-disable no-new */
import { makeAuthPatient } from 'test/factories/auth/make-auth-patient'
import { makeAuthPsychologist } from 'test/factories/auth/make-auth-psychologist'
import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { FakeMailPublisher } from 'test/notification-publisher/fake-mail'
import { InMemoryAuthPatientRepository } from 'test/repositories/auth/in-memory-patient-repository'
import { InMemoryAuthPsychologistRepository } from 'test/repositories/auth/in-memory-psychologist-repository'
import { InMemoryNotificationRepository } from 'test/repositories/notification/in-memory-notification-repository'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from 'test/utils/wait-for'

import { Order } from '@/domain/payment/enterprise/entities/order'
import { OrderItem } from '@/domain/payment/enterprise/entities/order-item'
import { PaymentMethod } from '@/domain/payment/enterprise/value-objects/payment-method'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'
import { OnOrderCreated } from './on-order-created'
let orderRepository: InMemoryOrderRepository
let useCase: SendNotificationUseCase
let fakeMailPublisher: FakeMailPublisher
let appointmentsRepository: InMemoryAppointmentsRepository
let patientRepository: InMemoryAuthPatientRepository
let psychologistRepository: InMemoryAuthPsychologistRepository
let notificationRepository: InMemoryNotificationRepository
describe('On Order Approved', () => {
  beforeEach(() => {
    psychologistRepository = new InMemoryAuthPsychologistRepository()
    patientRepository = new InMemoryAuthPatientRepository()
    appointmentsRepository = new InMemoryAppointmentsRepository()
    orderRepository = new InMemoryOrderRepository()
    fakeMailPublisher = new FakeMailPublisher()
    notificationRepository = new InMemoryNotificationRepository()
    useCase = new SendNotificationUseCase(
      fakeMailPublisher,
      notificationRepository,
    )
    new OnOrderCreated(useCase, psychologistRepository)
  })

  it('should send mail notification to psychologist when order is created', async () => {
    const useCaseSpy = vi.spyOn(useCase, 'execute')
    const psychologist = makeAuthPsychologist()
    const patient = makeAuthPatient()
    const appointment = makeAppointment({
      patientId: patient.id,
      psychologistId: psychologist.id,
      status: 'pending',
    })
    psychologistRepository.psychologists.push(psychologist)
    patientRepository.patients.push(patient)
    appointmentsRepository.appointments.push(appointment)

    const order = Order.create({
      costumerId: patient.id,
      sellerId: psychologist.id,
      paymentMethod: PaymentMethod.create({
        value: 'credit_card',
      }),
    })

    const orderItem = OrderItem.create({
      itemId: appointment.id,
      name: 'Appointment',
      orderId: order.id,
      quantity: 1,
      priceInCents: 1000,
    })

    order.addOderItem(orderItem)

    orderRepository.create(order)

    await waitFor(() => {
      expect(useCaseSpy).toHaveBeenCalled()
    })
    expect(fakeMailPublisher.notifications[0].to).toEqual(psychologist.email)
    expect(notificationRepository.notifications[0].to).toEqual(
      psychologist.email,
    )
    expect(appointmentsRepository.appointments[0].status).toEqual('pending')
  })
})
