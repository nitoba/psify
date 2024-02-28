import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderRejected } from '@/domain/payment/enterprise/events/order-rejected'

import { MarkAppointmentAsInactiveUseCase } from '../use-cases/mark-appointment-as-inactive'

export class OnOrderRejected implements EventHandler {
  constructor(
    private readonly markAsInactiveUseCase: MarkAppointmentAsInactiveUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.markAsScheduled.bind(this), OrderRejected.name)
  }

  private async markAsScheduled({ order }: OrderRejected) {
    const result = await this.markAsInactiveUseCase.execute({
      scheduleAppointmentId: order.orderItems[0].itemId.toString(),
    })

    if (result.isLeft()) {
      // TODO: retry this event
      console.log(result.value)
    }
  }
}
