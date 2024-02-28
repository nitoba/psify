import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Order } from '../../enterprise/entities/order'
import { OrderItem } from '../../enterprise/entities/order-item'
import { PaymentMethod } from '../../enterprise/value-objects/payment-method'
import { PaymentRepository } from '../repositories/payment-repository'

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

export class CreateIntentOrderUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute({
    costumerId,
    sellerId,
    orderItems,
  }: CreateIntentOrderUseCaseRequest): Promise<Either<Error, void>> {
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

    await this.paymentRepository.create(order)

    return right(undefined)
  }
}
