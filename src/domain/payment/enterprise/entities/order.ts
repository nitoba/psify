import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { OrderApproved } from '../events/order-approved'
import { OrderRejected } from '../events/order-rejected'
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

  addOrderItems(orderItems: OrderItem[]) {
    this.props.orderItems = orderItems
  }

  cancel(): Either<InvalidResource, void> {
    if (this.props.status !== 'pending') {
      return left(
        new InvalidResource('Order can only be canceled if it is pending'),
      )
    }

    this.props.status = 'canceled'

    this.addDomainEvent(new OrderRejected(this))

    return right(undefined)
  }

  approve(): Either<InvalidResource, void> {
    if (this.props.status !== 'pending' || this.props.orderItems.length === 0) {
      return left(
        new InvalidResource('Order can only be approved if it is pending'),
      )
    }

    this.props.status = 'approved'

    this.addDomainEvent(new OrderApproved(this))

    return right(undefined)
  }

  get isAvailableToApprove(): boolean {
    return this.props.status === 'pending' && this.props.orderItems.length > 0
  }

  static create(
    {
      status,
      orderItems,
      createdAt,
      updatedAt,
      ...props
    }: Optional<
      OrderProps,
      'createdAt' | 'updatedAt' | 'status' | 'orderItems'
    >,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        orderItems: orderItems ?? [], // TODO: Fix this, not create order with empty orderItems
        status: status ?? 'pending',
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
