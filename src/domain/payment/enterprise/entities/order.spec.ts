import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from '@/test/factories/payment/make-order'

import { PaymentMethod } from '../value-objects/payment-method'
import { Order } from './order'
import { OrderItem } from './order-item'

describe('Order', () => {
  let order: Order

  beforeEach(() => {
    const orderId = new UniqueEntityID()
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

    it('should not cancel an approved order', () => {
      order.approve()

      const result = order.cancel()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('approved')
    })
  })

  describe('approve', () => {
    it('should approve a pending order with items', () => {
      const result = order.approve()

      expect(result.isRight()).toBeTruthy()
      expect(order.status).toBe('approved')
    })

    it('should not approve an order without items', () => {
      const order = makeOrder()
      const result = order.approve()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('pending')
    })

    it('should not approve an already approved order', () => {
      order.approve()

      const result = order.approve()

      expect(result.isLeft()).toBeTruthy()
      expect(order.status).toBe('approved')
    })
  })

  describe('isAvailableToApprove', () => {
    it('should return true for pending order with items', () => {
      expect(order.isAvailableToApprove).toBeTruthy()
    })

    it('should return false for pending order without items', () => {
      const order = makeOrder()

      expect(order.isAvailableToApprove).toBeFalsy()
    })

    it('should return false for approved order', () => {
      order.approve()

      expect(order.isAvailableToApprove).toBeFalsy()
    })
  })
})
