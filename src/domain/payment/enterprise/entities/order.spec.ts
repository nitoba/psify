import { makeOrder } from 'test/factories/payment/make-order'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { PaymentMethod } from '../value-objects/payment-method'
import { Order } from './order'
import { OrderItem } from './order-item'

describe('Order', () => {
  let order: Order

  const orderId = new UniqueEntityID()
  beforeEach(() => {
    order = Order.create(
      {
        costumerId: new UniqueEntityID(),
        sellerId: new UniqueEntityID(),
        paymentMethod: PaymentMethod.create({ value: 'credit_card' }),
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      },
      orderId,
    )
  })

  describe('cancel', () => {
    it('should cancel a pending order', () => {
      const result = order.cancel()

      expect(result.isRight()).toBeTruthy()
      expect(order.status).toBe('canceled')
    })

    it('should not cancel an paid order', () => {
      const order = makeOrder({
        status: 'paid',
      })
      order.pay()

      const result = order.cancel()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('paid')
    })
  })

  describe('approve', () => {
    it('should not approve order that is not pending', () => {
      let order = makeOrder({
        status: 'approved',
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      })
      let result = order.approve()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('approved')

      order = makeOrder({
        status: 'paid',
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      })
      result = order.approve()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('paid')

      order = makeOrder({
        status: 'canceled',
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      })
      result = order.approve()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('canceled')
    })
    it('should approve order with items', () => {
      const order = makeOrder({
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      })
      const result = order.approve()

      expect(result.isRight()).toBeTruthy()
      expect(order.status).toBe('approved')
    })

    it('should not approve an order without items', () => {
      const order = makeOrder({
        orderItems: [],
      })
      const result = order.approve()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('pending')
    })

    it('should not approve an already paid approved', () => {
      const order = makeOrder({
        status: 'approved',
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      })

      const result = order.approve()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('approved')
    })
  })

  describe('pay', () => {
    it('should pay a approved order with items', () => {
      const order = makeOrder({
        status: 'approved',
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      })
      const result = order.pay()

      expect(result.isRight()).toBeTruthy()
      expect(order.status).toBe('paid')
    })

    it('should not pay an order without items', () => {
      const order = makeOrder({
        status: 'approved',
        orderItems: [],
      })
      const result = order.pay()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('approved')
    })

    it('should not pay an already paid order', () => {
      const order = makeOrder({
        status: 'paid',
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      })

      const result = order.pay()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('paid')
    })
  })

  describe('isAvailableToPay', () => {
    it('should return true for paid order with items', () => {
      const order = makeOrder({
        status: 'approved',
        orderItems: [
          OrderItem.create({
            itemId: new UniqueEntityID(),
            quantity: 1,
            name: 'Item 1',
            orderId,
            priceInCents: 100,
          }),
        ],
      })
      expect(order.isAvailableToBePaid).toBeTruthy()
    })

    it('should return false for paid order without items', () => {
      const order = makeOrder()

      expect(order.isAvailableToBePaid).toBeFalsy()
    })

    it('should return false for paid order', () => {
      order.pay()

      expect(order.isAvailableToBePaid).toBeFalsy()
    })
  })
})
