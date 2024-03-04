import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { OrderRepository } from '../repositories/order-repository'

type CancelOrderUseCaseRequest = {
  orderId: string
}

type CancelOrderUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

@Injectable()
export class CancelOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: CancelOrderUseCaseRequest): Promise<CancelOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      return left(new ResourceNotFound('Order not found'))
    }

    const result = order.cancel()

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.orderRepository.save(order)

    return right(undefined)
  }
}
