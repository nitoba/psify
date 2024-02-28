import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type OrderItemProps = {
  name: string
  itemId: UniqueEntityID
  priceInCents: number
  quantity: number
  orderId: UniqueEntityID
  createdAt: Date
}

export class OrderItem extends Entity<OrderItemProps> {
  get name(): string {
    return this.props.name
  }

  get itemId(): UniqueEntityID {
    return this.props.itemId
  }

  get priceInCents(): number {
    return this.props.priceInCents
  }

  get quantity(): number {
    return this.props.quantity
  }

  get orderId(): UniqueEntityID {
    return this.props.orderId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }
}
