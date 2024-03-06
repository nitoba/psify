import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/payment/enterprise/entities/order'
import { PaymentMethod } from '@/domain/payment/enterprise/value-objects/payment-method'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'
import { orderItems, orders } from '@/infra/database/drizzle/schemas/order'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      costumerId: new UniqueEntityID(),
      sellerId: new UniqueEntityID(),
      status: 'pending',
      orderItems: [],
      paymentMethod: PaymentMethod.create({
        value: 'card',
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  )
  return order
}

@Injectable()
export class OrderFactory {
  constructor(private drizzle: DrizzleService) {}
  async makeDbOrder(override: Partial<OrderProps> = {}, id?: UniqueEntityID) {
    const order = makeOrder(override, id)

    const [orderDB] = await this.drizzle.client
      .insert(orders)
      .values({
        id: order.id.toString(),
        costumerId: order.costumerId.toString(),
        sellerId: order.sellerId.toString(),
        status: order.status,
        paymentMethod: order.paymentMethod.value,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })
      .returning()

    for (const orderItem of order.orderItems) {
      await this.drizzle.client.insert(orderItems).values({
        itemId: orderItem.itemId.toString(),
        name: orderItem.name,
        priceInCents: orderItem.priceInCents,
        quantity: orderItem.quantity,
        createdAt: orderItem.createdAt,
        orderId: orderDB.id,
      })
    }

    return orderDB
  }
}
