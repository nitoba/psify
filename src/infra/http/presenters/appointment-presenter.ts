import { Appointment } from '@/domain/schedules/enterprise/entities/appointment'

export class AppointmentPresenter {
  static toHttp(appointment: Appointment) {
    return {
      id: appointment.id.toString(),
      patientId: appointment.patientId.toString(),
      psychologistId: appointment.psychologistId.toString(),
      status: appointment.status,
      costInCents: appointment.costInCents,
      scheduledTo: appointment.scheduledTo,
    }
  }
}
