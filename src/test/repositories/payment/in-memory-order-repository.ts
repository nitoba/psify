import { OrderRepository } from '@/domain/payment/application/repositories/order-repository'
import { Order } from '@/domain/payment/enterprise/entities/order'

export class InMemoryOrderRepository implements OrderRepository {
  orders: Order[] = []

  async findByItemId(itemId: string): Promise<Order | null> {
    const order = this.orders.filter((o) =>
      o.orderItems.some((i) => i.itemId.toString() === itemId),
    )

    return order[0] ?? null
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.find((o) => o.id.toString() === id)
    return order ?? null
  }

  async create(entity: Order): Promise<void> {
    this.orders.push(entity)
  }

  async save(order: Order): Promise<void> {
    const index = this.orders.findIndex(
      (o) => o.id.toString() === order.id.toString(),
    )
    this.orders[index] = order
  }
}
