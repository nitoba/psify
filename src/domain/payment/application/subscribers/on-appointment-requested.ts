import { left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'
import { AppointmentRequested } from '@/domain/schedules/enterprise/events/appointment-requested'

import { OrderRepository } from '../repositories/order-repository'
import { CreateIntentOrderUseCase } from '../use-cases/create-intent-order'

export class OnAppointmentCreatedHandler implements EventHandler {
  constructor(
    private readonly createOrderUseCase: CreateIntentOrderUseCase,
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  setupSubscriptions(): void {
    DomainEvents.register(
      this.createOrder.bind(this),
      AppointmentRequested.name,
    )
  }

  private async createOrder({ appointment }: AppointmentRequested) {
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
      paymentMethod: 'credit_card',
      orderItems: [
        {
          itemId: appointment.id.toString(),
          name: 'Consultation',
          //   priceInCents: appointment.cost,
          priceInCents: 100 * 100, // TODO: get this value from the appointment
        },
      ],
    })
    if (result.isLeft()) {
      return left(result.value)
    }

    return right(undefined)
  }
}
