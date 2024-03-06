import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import { OrderCreated } from '@/domain/payment/enterprise/events/order-created'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'

export class OnOrderCreated implements EventHandler {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly psychologistRepository: AuthPsychologistRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendMailNotificationToPsychologist.bind(this),
      OrderCreated.name,
    )
  }

  private async sendMailNotificationToPsychologist({ order }: OrderCreated) {
    const psychologist = await this.psychologistRepository.findById(
      order.sellerId.toString(),
    )

    if (!psychologist) return

    await this.sendNotificationUseCase.execute({
      to: psychologist.email,
      subject: 'Order created',
      content: `The order with id ${order.id.toString()} was created`,
    })
  }
}
