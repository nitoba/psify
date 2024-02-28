import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type OrderProps = {
  costumerId: UniqueEntityID
  status: string
  createdAt: Date
  updatedAt: Date
}

export class Order extends AggregateRoot<OrderProps> {}
