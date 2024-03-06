import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'
import { AppointmentApproved } from '@/domain/schedules/enterprise/events/appointment-approved'

import { OrderRepository } from '../repositories/order-repository'
import { CreateIntentOrderUseCase } from '../use-cases/create-intent-order'

@Injectable()
export class OnAppointmentApprovedHandler implements EventHandler {
  constructor(
    private readonly createOrderUseCase: CreateIntentOrderUseCase,
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly orderRepository: OrderRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.createOrder.bind(this), AppointmentApproved.name)
  }

  private async createOrder({ appointment }: AppointmentApproved) {
    const appointmentExists = await this.appointmentRepository.findById(
      appointment.id.toString(),
    )

    if (!appointmentExists) {
      return left(new ResourceNotFound('Appointment not found'))
    }

    const orderExistsForThisAppointment =
      await this.orderRepository.findByItemId(appointment.id.toString())

    if (orderExistsForThisAppointment) {
      return left(new InvalidResource('Order already exists'))
    }

    const result = await this.createOrderUseCase.execute({
      costumerId: appointment.patientId.toString(),
      sellerId: appointment.psychologistId.toString(),
      paymentMethod: 'card',
      orderItems: [
        {
          itemId: appointment.id.toString(),
          name: 'Consultation',
          priceInCents: appointment.costInCents,
        },
      ],
    })
    if (result.isLeft()) {
      return left(result.value)
    }

    return right(undefined)
  }
}
