import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'

import { PaymentMethod } from '../../enterprise/value-objects/payment-method'
import { CreateIntentOrderUseCase } from './create-intent-order'

describe('CreateIntentOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository
  let useCase: CreateIntentOrderUseCase

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    useCase = new CreateIntentOrderUseCase(orderRepository)
  })

  it('should create a new order with items', async () => {
    const orderItems = [
      {
        name: 'Item 1',
        itemId: new UniqueEntityID().toString(),
        priceInCents: 1000,
      },
    ]

    await useCase.execute({
      costumerId: '123',
      sellerId: '456',
      paymentMethod: 'credit_card',
      orderItems,
    })

    const order = orderRepository.orders[0]

    expect(order.id).toBeInstanceOf(UniqueEntityID)
    expect(order.costumerId).toBeInstanceOf(UniqueEntityID)
    expect(order.sellerId).toBeInstanceOf(UniqueEntityID)
    expect(order.paymentMethod).toBeInstanceOf(PaymentMethod)
    expect(order.orderItems).toHaveLength(1)
    expect(order.orderItems[0].name).toBe('Item 1')
  })
})
