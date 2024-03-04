import { makeOrder } from 'test/factories/payment/make-order'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'

import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { OrderItem } from '../../enterprise/entities/order-item'
import { PayOrderUseCase } from './pay-order'

describe('PayOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository
  let useCase: PayOrderUseCase

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    useCase = new PayOrderUseCase(orderRepository)
  })

  it('should return ResourceNotFound error if order does not exist', async () => {
    const orderId = new UniqueEntityID().toString()

    const result = await useCase.execute({ orderId })

    expect(result).toEqual(left(new ResourceNotFound('Order not found')))
  })

  it('should return InvalidResource error if order is already paid or canceled', async () => {
    let order = makeOrder({
      status: 'paid',
    })

    orderRepository.orders.push(order)

    let result = await useCase.execute({ orderId: order.id.toString() })
    expect(result).toEqual(
      left(
        new InvalidResource(
          'Order can only be pay if it is approved and has items',
        ),
      ),
    )

    order = makeOrder({
      status: 'paid',
    })

    orderRepository.orders.push(order)

    result = await useCase.execute({ orderId: order.id.toString() })
    expect(result).toEqual(
      left(
        new InvalidResource(
          'Order can only be pay if it is approved and has items',
        ),
      ),
    )
  })

  it('should pay order successfully', async () => {
    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
        status: 'approved',
        orderItems: [
          OrderItem.create({
            name: 'Item 1',
            itemId: new UniqueEntityID(),
            orderId,
            quantity: 1,
            priceInCents: 1000,
          }),
        ],
      },
      orderId,
    )

    orderRepository.orders.push(order)

    const result = await useCase.execute({ orderId: order.id.toString() })

    expect(result).toEqual(right(undefined))
    expect(orderRepository.orders[0].status).toEqual('paid')
  })
})
