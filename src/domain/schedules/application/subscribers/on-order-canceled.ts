import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderCanceled } from '@/domain/payment/enterprise/events/order-canceled'

import { MarkAppointmentAsInactiveUseCase } from '../use-cases/mark-appointment-as-inactive'

export class OnOrderCanceled implements EventHandler {
  constructor(
    private readonly markAsInactiveUseCase: MarkAppointmentAsInactiveUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.maskAsInactive.bind(this), OrderCanceled.name)
  }

  private async maskAsInactive({ order }: OrderCanceled) {
    const result = await this.markAsInactiveUseCase.execute({
      scheduleAppointmentId: order.orderItems[0].itemId.toString(),
    })

    if (result.isLeft()) {
      // TODO: retry this event
      console.log(result.value)
    }
  }
}
