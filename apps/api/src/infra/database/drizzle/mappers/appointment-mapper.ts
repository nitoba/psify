import { InferSelectModel } from 'drizzle-orm'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Appointment,
  AppointmentStatuses,
} from '@/domain/schedules/enterprise/entities/appointment'

import { appointments } from '../schemas/appointment'

export function toDomain(
  model: InferSelectModel<typeof appointments>,
): Appointment {
  const appointment = Appointment.create(
    {
      costInCents: model.costInCents,
      patientId: new UniqueEntityID(model.patientId),
      psychologistId: new UniqueEntityID(model.psychologistId),
      scheduledTo: model.scheduledTo,
      createdAt: model.createdAt!,
      status: model.status as AppointmentStatuses,
    },
    new UniqueEntityID(model.id),
  )

  return appointment
}
