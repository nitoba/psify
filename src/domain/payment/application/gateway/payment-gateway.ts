import { Order } from '../../enterprise/entities/order'

export abstract class PaymentGateway {
  abstract requestPayment(order: Order): Promise<string | null>
  abstract pay(order: Order): Promise<void>
}
