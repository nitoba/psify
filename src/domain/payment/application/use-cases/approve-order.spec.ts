import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { makeOrder } from '@/test/factories/payment/make-order'
import { InMemoryOrderRepository } from '@/test/repositories/payment/in-memory-order-repository'

import { OrderItem } from '../../enterprise/entities/order-item'
import { ApproveOrderUseCase } from './approve-order'

describe('ApproveOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository
  let useCase: ApproveOrderUseCase

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    useCase = new ApproveOrderUseCase(orderRepository)
  })

  it('should return ResourceNotFound error if order does not exist', async () => {
    const orderId = new UniqueEntityID().toString()

    const result = await useCase.execute({ orderId })

    expect(result).toEqual(left(new ResourceNotFound('Order not found')))
  })

  it('should return InvalidResource error if order is already approved or canceled', async () => {
    let order = makeOrder({
      status: 'approved',
    })

    orderRepository.orders.push(order)

    let result = await useCase.execute({ orderId: order.id.toString() })
    expect(result).toEqual(
      left(new InvalidResource('Order can only be approved if it is pending')),
    )

    order = makeOrder({
      status: 'approved',
    })

    orderRepository.orders.push(order)

    result = await useCase.execute({ orderId: order.id.toString() })
    expect(result).toEqual(
      left(new InvalidResource('Order can only be approved if it is pending')),
    )
  })

  it.only('should approve order successfully', async () => {
    const orderId = new UniqueEntityID()
    const order = makeOrder(
      {
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
    expect(orderRepository.orders[0].status).toEqual('approved')
  })
})
