import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { OrderRepository } from '../repositories/order-repository'

type PayOrderUseCaseRequest = {
  orderId: string
}

type PayOrderUseCaseResponse = Either<ResourceNotFound | InvalidResource, void>

export class PayOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: PayOrderUseCaseRequest): Promise<PayOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      return left(new ResourceNotFound('Order not found'))
    }

    const result = order.pay()

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.orderRepository.save(order)

    return right(undefined)
  }
}
