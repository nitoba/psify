import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'

import { OrderRepository } from '@/domain/payment/application/repositories/order-repository'
import { Order } from '@/domain/payment/enterprise/entities/order'

import { DrizzleService } from '../drizzle.service'
import { toDomain } from '../mappers/order-mapper'
import { orderItems, orders } from '../schemas/order'

@Injectable()
export class DrizzleOrderRepository implements OrderRepository {
  constructor(private drizzle: DrizzleService) {}

  async findByItemId(itemId: string): Promise<Order | null> {
    const orderItem = await this.drizzle.client.query.orderItems.findFirst({
      with: {
        order: true,
      },
      where: (o, { eq }) => eq(o.itemId, itemId),
    })

    if (!orderItem) return null

    const order = {
      ...orderItem.order,
      orderItems: [orderItem],
    }

    return toDomain(order)
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.drizzle.client.query.orders.findFirst({
      with: {
        orderItems: true,
      },
      where: (o, { eq }) => eq(o.id, id),
    })

    if (!order) return null

    return toDomain(order)
  }

  async save(order: Order): Promise<void> {
    await this.drizzle.client
      .update(orders)
      .set({
        costumerId: order.costumerId.toString(),
        sellerId: order.sellerId.toString(),
        paymentMethod: order.paymentMethod.value,
        status: order.status,
        updatedAt: order.updatedAt,
      })
      .where(eq(orders.id, order.id.toString()))
      .execute()
  }

  async create(entity: Order): Promise<void> {
    await this.drizzle.client
      .transaction(async (tx) => {
        const [orderCreated] = await tx
          .insert(orders)
          .values({
            id: entity.id.toString(),
            costumerId: entity.costumerId.toString(),
            sellerId: entity.sellerId.toString(),
            paymentMethod: entity.paymentMethod.value,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
          })
          .returning()
        const orderItemsValues = entity.orderItems.map((orderItem) => ({
          orderId: orderCreated.id,
          itemId: orderItem.itemId.toString(),
          name: orderItem.name,
          priceInCents: orderItem.priceInCents,
          quantity: orderItem.quantity,
          createdAt: orderItem.createdAt,
        }))
        await this.drizzle.client.insert(orderItems).values(orderItemsValues)
      })
      .then(() => {
        console.log('Order created')
      })
      .catch((err) => {
        console.log('Order not created')
        console.log(err)
      })
  }
}
