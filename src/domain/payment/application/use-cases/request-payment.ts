import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { PaymentGateway } from '../gateway/payment-gateway'
import { OrderRepository } from '../repositories/order-repository'

type RequestPaymentUseCaseRequest = {
  orderId: string
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
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute({
    orderId,
  }: RequestPaymentUseCaseRequest): Promise<RequestPaymentUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound('Order not found'))
    }

    if (!order.isAvailableToBePaid) {
      return left(new InvalidResource('Order already paid'))
    }

    const paymentUrl = await this.paymentGateway.requestPayment(order)

    if (!paymentUrl) {
      return left(new InvalidResource('Payment gateway error'))
    }

    return right({ paymentUrl })
  }
}
