import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Order } from '../../enterprise/entities/order'
import { OrderItem } from '../../enterprise/entities/order-item'
import { PaymentMethod } from '../../enterprise/value-objects/payment-method'
import { OrderRepository } from '../repositories/order-repository'

type CreateIntentOrderUseCaseRequest = {
  costumerId: string
  sellerId: string
  paymentMethod: string
  orderItems: {
    name: string
    itemId: string
    priceInCents: number
  }[]
}

type CreateIntentOrderUseCaseResponse = Either<Error, void>

@Injectable()
export class CreateIntentOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    costumerId,
    sellerId,
    orderItems,
  }: CreateIntentOrderUseCaseRequest): Promise<CreateIntentOrderUseCaseResponse> {
    const order = Order.create({
      costumerId: new UniqueEntityID(costumerId),
      sellerId: new UniqueEntityID(sellerId),
      paymentMethod: PaymentMethod.create({
        value: 'credit_card',
      }),
    })

    const items = orderItems.map((orderItem) => {
      return OrderItem.create({
        name: orderItem.name,
        itemId: new UniqueEntityID(orderItem.itemId),
        orderId: order.id,
        priceInCents: orderItem.priceInCents,
        quantity: 1,
      })
    })

    order.addOrderItems(items)

    await this.orderRepository.create(order)

    return right(undefined)
  }
}
