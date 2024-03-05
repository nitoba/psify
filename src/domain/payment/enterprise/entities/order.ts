import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { OrderApproved } from '../events/order-approved'
import { OrderCanceled } from '../events/order-canceled'
import { OrderCreated } from '../events/order-created'
import { OrderPaid } from '../events/order-paid'
import { PaymentMethod } from '../value-objects/payment-method'
import { OrderItem } from './order-item'

type OrderStatuses = 'pending' | 'approved' | 'canceled' | 'paid'

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

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  addOrderItems(orderItems: OrderItem[]) {
    this.props.orderItems = orderItems
  }

  cancel(): Either<InvalidResource, void> {
    if (['canceled', 'paid'].includes(this.props.status)) {
      return left(
        new InvalidResource(
          'Order can only be canceled if it is pending or approved',
        ),
      )
    }

    this.props.status = 'canceled'

    this.addDomainEvent(new OrderCanceled(this))

    this.touch()

    return right(undefined)
  }

  pay(): Either<InvalidResource, void> {
    if (
      this.props.status !== 'approved' ||
      this.props.orderItems.length === 0
    ) {
      return left(
        new InvalidResource(
          'Order can only be pay if it is paid and has items',
        ),
      )
    }

    this.props.status = 'paid'

    this.addDomainEvent(new OrderPaid(this))
    this.touch()

    return right(undefined)
  }

  approve(): Either<InvalidResource, void> {
    if (this.props.status !== 'pending' || this.props.orderItems.length === 0) {
      return left(
        new InvalidResource(
          'Order can only be pay if it is approved and has items',
        ),
      )
    }

    this.props.status = 'approved'

    this.addDomainEvent(new OrderApproved(this))
    this.touch()

    return right(undefined)
  }

  get isAvailableToApprove(): boolean {
    return this.props.status === 'pending' && this.props.orderItems.length > 0
  }

  get isAvailableToBePaid(): boolean {
    return this.props.status === 'approved' && this.props.orderItems.length > 0
  }

  addOderItem(orderItem: OrderItem) {
    this.props.orderItems.push(orderItem)
    this.touch()
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

    const isNewOrder = !id

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreated(order))
    }

    return order
  }
}
