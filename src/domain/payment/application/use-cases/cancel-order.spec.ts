import { makeOrder } from 'test/factories/payment/make-order'
import { InMemoryOrderRepository } from 'test/repositories/payment/in-memory-order-repository'

import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { CancelOrderUseCase } from './cancel-order'

describe('CancelOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository
  let useCase: CancelOrderUseCase

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    useCase = new CancelOrderUseCase(orderRepository)
  })

  it('should return ResourceNotFound error if order does not exist', async () => {
    const orderId = new UniqueEntityID().toString()

    const result = await useCase.execute({ orderId })

    expect(result).toEqual(left(new ResourceNotFound('Order not found')))
  })

  it('should return InvalidResource error if order is already canceled or paid', async () => {
    let order = makeOrder({
      status: 'canceled',
    })

    orderRepository.orders.push(order)

    let result = await useCase.execute({ orderId: order.id.toString() })
    expect(result).toEqual(
      left(
        new InvalidResource(
          'Order can only be canceled if it is pending or approved',
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
          'Order can only be canceled if it is pending or approved',
        ),
      ),
    )
  })

  it('should cancel order successfully', async () => {
    const order = makeOrder()

    orderRepository.orders.push(order)

    const result = await useCase.execute({ orderId: order.id.toString() })

    expect(result).toEqual(right(undefined))
    expect(orderRepository.orders[0].status).toEqual('canceled')
  })
})
