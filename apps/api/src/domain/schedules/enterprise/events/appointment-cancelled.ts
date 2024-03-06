import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Appointment } from '../entities/appointment'

export class AppointmentCancelled implements DomainEvent {
  ocurredAt: Date
  appointment: Appointment
  previousStatus: Appointment['status']

  constructor(appointment: Appointment, previousStatus: Appointment['status']) {
    this.ocurredAt = new Date()
    this.appointment = appointment
    this.previousStatus = previousStatus
  }

  getAggregateId(): UniqueEntityID {
    return this.appointment.id
  }
}
