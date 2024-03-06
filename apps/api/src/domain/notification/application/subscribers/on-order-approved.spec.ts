/* eslint-disable no-new */
import { makeAuthPatient } from 'test/factories/auth/make-auth-patient'
import { makeOrder } from 'test/factories/payment/make-order'
import { makePsychologist } from 'test/factories/psychologist/make-psychologist'
import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { FakeMailPublisher } from 'test/notification-publisher/fake-mail'
import { InMemoryAuthPatientRepository } from 'test/repositories/auth/in-memory-patient-repository'
import { InMemoryNotificationRepository } from 'test/repositories/notification/in-memory-notification-repository'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from 'test/utils/wait-for'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/payment/enterprise/entities/order-item'
import { MarkAppointmentAsScheduledUseCase } from '@/domain/schedules/application/use-cases/mark-appointment-as-scheduled'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'
import { OnOrderApproved } from './on-order-approved'
let orderRepository: InMemoryOrderRepository
let sendNotificationUseCase: SendNotificationUseCase
let fakeMailPublisher: FakeMailPublisher
let appointmentsRepository: InMemoryAppointmentsRepository
let patientRepository: InMemoryAuthPatientRepository
let notificationRepository: InMemoryNotificationRepository
let markAsScheduledUseCase: MarkAppointmentAsScheduledUseCase
describe('On Order Approved', () => {
  beforeEach(() => {
    patientRepository = new InMemoryAuthPatientRepository()
    appointmentsRepository = new InMemoryAppointmentsRepository()
    orderRepository = new InMemoryOrderRepository()
    fakeMailPublisher = new FakeMailPublisher()
    notificationRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      fakeMailPublisher,
      notificationRepository,
    )
    markAsScheduledUseCase = new MarkAppointmentAsScheduledUseCase(
      appointmentsRepository,
    )
    new OnOrderApproved(
      sendNotificationUseCase,
      patientRepository,
      markAsScheduledUseCase,
    )
  })

  it('should send mail notification to patient when order is approved', async () => {
    const sendNotificationUseCaseSpy = vi.spyOn(
      sendNotificationUseCase,
      'execute',
    )
    const markAsScheduledUseCaseSpy = vi.spyOn(
      markAsScheduledUseCase,
      'execute',
    )
    const psychologist = makePsychologist()
    const patient = makeAuthPatient()
    const appointment = makeAppointment({
      patientId: patient.id,
      psychologistId: psychologist.id,
      status: 'approved',
    })
    patientRepository.patients.push(patient)
    appointmentsRepository.appointments.push(appointment)

    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
        status: 'pending',
        costumerId: patient.id,
        sellerId: psychologist.id,
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
      expect(sendNotificationUseCaseSpy).toHaveBeenCalled()
      expect(markAsScheduledUseCaseSpy).toHaveBeenCalled()
    })
    expect(fakeMailPublisher.notifications[0].to).toEqual(patient.email)
    expect(appointmentsRepository.appointments[0].status).toEqual('scheduled')
  })
})
