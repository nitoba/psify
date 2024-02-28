import { Either } from '@/core/either'

import { Order } from '../../enterprise/entities/order'
import { PaymentRecused } from './errors/payment-recused'

export abstract class PaymentGateway {
  abstract create(order: Order): Promise<Either<PaymentRecused, string>>
  abstract pay(order: Order): Promise<Either<PaymentRecused, string>>
}
