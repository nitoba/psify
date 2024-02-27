import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Appointment,
  AppointmentProps,
} from '@/domain/schedules/enterprise/entities/appointment'

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
      ...override,
    },
    id,
  )
  return appointment
}
