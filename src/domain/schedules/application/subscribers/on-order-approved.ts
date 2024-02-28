import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderApproved } from '@/domain/payment/enterprise/events/order-approved'

import { MarkAppointmentAsScheduledUseCase } from '../use-cases/mark-appointment-as-scheduled'

export class OnOrderApproved implements EventHandler {
  constructor(
    private readonly markAsScheduledUseCase: MarkAppointmentAsScheduledUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.markAsScheduled.bind(this), OrderApproved.name)
  }

  private async markAsScheduled({ order }: OrderApproved) {
    const result = await this.markAsScheduledUseCase.execute({
      scheduleAppointmentId: order.orderItems[0].itemId.toString(),
    })

    if (result.isLeft()) {
      // TODO: retry this event
      console.log(result.value)
    }

    return result
  }
}
