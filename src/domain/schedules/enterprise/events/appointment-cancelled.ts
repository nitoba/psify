import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Appointment } from '../entities/appointment'

export class AppointmentCancelled implements DomainEvent {
  ocurredAt: Date
  appointment: Appointment

  constructor(appointment: Appointment) {
    this.ocurredAt = new Date()
    this.appointment = appointment
  }

  getAggregateId(): UniqueEntityID {
    return this.appointment.id
  }
}
