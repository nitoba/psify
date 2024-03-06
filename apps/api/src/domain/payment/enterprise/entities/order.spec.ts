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
        paymentMethod: PaymentMethod.create({ value: 'card' }),
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

    it('should not cancel an approved order', () => {
      const order = makeOrder({
        status: 'approved',
      })

      const result = order.cancel()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('approved')
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
      result = order.approve()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('approved')

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

    it('should not approve an already approved approved', () => {
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
  describe('isAvailableToApprove', () => {
    it('should return true for approved order with items', () => {
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
      expect(order.isAvailableToApprove).toBeTruthy()
    })

    it('should return false for approved order without items', () => {
      const order = makeOrder()

      expect(order.isAvailableToApprove).toBeFalsy()
    })

    it('should return false for approved order', () => {
      order.approve()

      expect(order.isAvailableToApprove).toBeFalsy()
    })
  })
})
