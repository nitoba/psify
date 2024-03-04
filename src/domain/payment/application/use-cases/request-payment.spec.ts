import { makeOrder } from 'test/factories/payment/make-order'
import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { FakePaymentGateway } from 'test/gateway/fake-payment-gateway'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { OrderItem } from '../../enterprise/entities/order-item'
import { PaymentGateway } from '../gateway/payment-gateway'
import { RequestPaymentUseCase } from './request-payment'

describe('RequestPaymentUseCase', () => {
  let paymentGateway: PaymentGateway
  let appointmentsRepository: InMemoryAppointmentsRepository
  let orderRepository: InMemoryOrderRepository
  let requestPaymentUseCase: RequestPaymentUseCase
  beforeEach(() => {
    paymentGateway = new FakePaymentGateway()
    orderRepository = new InMemoryOrderRepository()
    appointmentsRepository = new InMemoryAppointmentsRepository()
    requestPaymentUseCase = new RequestPaymentUseCase(
      paymentGateway,
      appointmentsRepository,
      orderRepository,
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not be able to request payment if appointment not exits', async () => {
    const appointmentId = new UniqueEntityID().toString()
    const result = await requestPaymentUseCase.execute({ appointmentId })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new ResourceNotFound('Appointment not found'))
  })

  it('should not be able to request payment if order not exits', async () => {
    const appointmentId = new UniqueEntityID()

    const appointment = makeAppointment({}, appointmentId)

    appointmentsRepository.appointments.push(appointment)

    const result = await requestPaymentUseCase.execute({
      appointmentId: appointmentId.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new ResourceNotFound('Order not found'))
  })

  it('should not be able to request payment if order is already paid', async () => {
    const appointmentId = new UniqueEntityID()

    const appointment = makeAppointment({}, appointmentId)

    appointmentsRepository.appointments.push(appointment)

    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
        status: 'paid',
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

    const result = await requestPaymentUseCase.execute({
      appointmentId: appointmentId.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new ResourceNotFound('Order already paid'))
  })

  it('should not be able request payment is payment gateway fail', async () => {
    vi.spyOn(paymentGateway, 'requestPayment').mockImplementationOnce(
      async () => null,
    )
    const appointmentId = new UniqueEntityID()

    const appointment = makeAppointment({}, appointmentId)

    appointmentsRepository.appointments.push(appointment)

    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
        status: 'approved',
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

    const result = await requestPaymentUseCase.execute({
      appointmentId: appointmentId.toString(),
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new InvalidResource('Payment gateway error'))
  })

  it('should request payment and return payment url', async () => {
    const appointmentId = new UniqueEntityID()

    const appointment = makeAppointment({}, appointmentId)

    appointmentsRepository.appointments.push(appointment)

    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
        status: 'approved',
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

    const result = await requestPaymentUseCase.execute({
      appointmentId: appointmentId.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        paymentUrl: expect.any(String),
      }),
    )
  })
})
