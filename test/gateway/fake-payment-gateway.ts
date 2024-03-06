import { PaymentGateway } from '@/domain/payment/application/gateway/payment-gateway'
import { Order } from '@/domain/payment/enterprise/entities/order'

export class FakePaymentGateway implements PaymentGateway {
  async approveOrder(orderId: string): Promise<void> {
    console.log(orderId)
  }

  async cancelOrder(orderId: string): Promise<void> {
    console.log(orderId)
  }

  async requestPayment(order: Order): Promise<string | null> {
    return 'https://fake-payment-gateway.com/payment-id' + order.id.toString()
  }

  async pay(order: Order): Promise<void> {
    console.log(order)
  }
}
