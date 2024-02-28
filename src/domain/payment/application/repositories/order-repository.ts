import { Repository } from '@/domain/core/application/repositories/repository'

import { Order } from '../../enterprise/entities/order'

export abstract class OrderRepository extends Repository<Order> {
  abstract findByItemId(itemId: string): Promise<Order | null>
}
