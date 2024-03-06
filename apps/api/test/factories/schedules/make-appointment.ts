import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Appointment,
  AppointmentProps,
} from '@/domain/schedules/enterprise/entities/appointment'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'
import { appointments } from '@/infra/database/drizzle/schemas'

export function makeAppointment(
  override: Partial<AppointmentProps> = {},
  id?: UniqueEntityID,
) {
  const appointment = Appointment.create(
    {
      patientId: new UniqueEntityID(),
      psychologistId: new UniqueEntityID(),
      scheduledTo: new Date(),
      status: 'pending',
      costInCents: 100 * 100, // 100 moneys
      ...override,
    },
    id,
  )
  return appointment
}

@Injectable()
export class AppointmentFactory {
  constructor(private drizzle: DrizzleService) {}
  async makeDbAppointment(
    override: Partial<AppointmentProps> = {},
    id?: UniqueEntityID,
  ) {
    const appointment = makeAppointment(override, id)
    const [appointmentDb] = await this.drizzle.client
      .insert(appointments)
      .values({
        id: appointment.id.toString(),
        costInCents: appointment.costInCents,
        patientId: appointment.patientId.toString(),
        psychologistId: appointment.psychologistId.toString(),
        createdAt: appointment.createdAt,
        status: appointment.status,
        scheduledTo: appointment.scheduledTo,
        updatedAt: new Date(),
      })
      .returning()

    return appointmentDb
  }
}
