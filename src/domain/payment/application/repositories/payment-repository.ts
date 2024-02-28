import { Repository } from '@/domain/core/application/repositories/repository'

import { Order } from '../../enterprise/entities/order'

export abstract class PaymentRepository extends Repository<Order> {}
