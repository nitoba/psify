import { left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'
import { AppointmentRequested } from '@/domain/schedules/enterprise/events/appointment-requested'

import { OrderRepository } from '../repositories/order-repository'
import { ApproveOrderUseCase } from '../use-cases/approve-order'

export class OnAppointmentApprovedHandler implements EventHandler {
  constructor(
    private readonly approveOrderUseCase: ApproveOrderUseCase,
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly orderRepository: OrderRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.approveOrder.bind(this),
      AppointmentRequested.name,
    )
  }

  private async approveOrder({ appointment }: AppointmentRequested) {
    const appointmentExists = await this.appointmentRepository.findById(
      appointment.id.toString(),
    )

    if (!appointmentExists) {
      return left(new ResourceNotFound('Appointment not found'))
    }

    const order = await this.orderRepository.findByItemId(
      appointment.id.toString(),
    )

    if (!order) {
      return left(new ResourceNotFound('Order not found'))
    }

    const result = await this.approveOrderUseCase.execute({
      orderId: order.id.toString(),
    })

    if (result.isLeft()) {
      return left(result.value)
    }

    return right(undefined)
  }
}
