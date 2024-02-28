import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { PaymentMethod } from '../value-objects/payment-method'
import { OrderItem } from './order-item'

type OrderStatuses = 'pending' | 'approved' | 'canceled'

export type OrderProps = {
  costumerId: UniqueEntityID
  sellerId: UniqueEntityID
  status: OrderStatuses
  orderItems: OrderItem[]
  paymentMethod: PaymentMethod
  createdAt: Date
  updatedAt: Date
}

export class Order extends AggregateRoot<OrderProps> {
  get costumerId() {
    return this.props.costumerId
  }

  get sellerId() {
    return this.props.sellerId
  }

  get status(): OrderStatuses {
    return this.props.status
  }

  get orderItems(): OrderItem[] {
    return this.props.orderItems
  }

  get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod
  }
}
