import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'

import { PaymentGateway } from '../gateway/payment-gateway'
import { OrderRepository } from '../repositories/order-repository'

type RequestPaymentUseCaseRequest = {
  appointmentId: string
}

type RequestPaymentUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  {
    paymentUrl: string
  }
>

export class RequestPaymentUseCase {
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute({
    appointmentId,
  }: RequestPaymentUseCaseRequest): Promise<RequestPaymentUseCaseResponse> {
    const appointment =
      await this.appointmentsRepository.findById(appointmentId)

    if (!appointment) {
      return left(new ResourceNotFound('Appointment not found'))
    }
    const orderExistsForThisAppointment =
      await this.orderRepository.findByItemId(appointmentId)

    if (!orderExistsForThisAppointment) {
      return left(new ResourceNotFound('Order not found'))
    }

    if (!orderExistsForThisAppointment.isAvailableToApprove) {
      return left(new InvalidResource('Order already paid'))
    }

    const paymentUrl = await this.paymentGateway.requestPayment(
      orderExistsForThisAppointment,
    )

    if (!paymentUrl) {
      return left(new InvalidResource('Payment gateway error'))
    }

    return right({ paymentUrl })
  }
}
