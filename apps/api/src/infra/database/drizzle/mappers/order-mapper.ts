import { InferSelectModel } from 'drizzle-orm'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/payment/enterprise/entities/order'
import { OrderItem } from '@/domain/payment/enterprise/entities/order-item'
import {
  PaymentMethod,
  Source,
} from '@/domain/payment/enterprise/value-objects/payment-method'

import { orderItems, orders } from '../schemas/order'

type Model = InferSelectModel<typeof orders> & {
  orderItems: InferSelectModel<typeof orderItems>[]
}

export function toDomainOrderItem(model: InferSelectModel<typeof orderItems>) {
  const orderItem = OrderItem.create(
    {
      name: model.name,
      orderId: new UniqueEntityID(model.orderId),
      priceInCents: model.priceInCents,
      itemId: new UniqueEntityID(model.itemId),
      quantity: model.quantity,
      createdAt: model.createdAt!,
    },
    new UniqueEntityID(model.id),
  )
  return orderItem
}

export function toDomain(model: Model): Order {
  const order = Order.create(
    {
      costumerId: new UniqueEntityID(model.costumerId),
      sellerId: new UniqueEntityID(model.sellerId),
      status: model.status,
      orderItems: model.orderItems.map(toDomainOrderItem),
      paymentMethod: PaymentMethod.create({
        value: model.paymentMethod as Source,
      }),
      createdAt: model.createdAt!,
      updatedAt: model.updatedAt!,
    },
    new UniqueEntityID(model.id),
  )

  return order
}
