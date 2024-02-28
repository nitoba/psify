import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/payment/enterprise/entities/order'
import { PaymentMethod } from '@/domain/payment/enterprise/value-objects/payment-method'

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
        value: 'credit_card',
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  )
  return order
}
