import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'

import {
  Appointment,
  AppointmentStatuses,
} from '../../enterprise/entities/appointment'

export type FindByAppointmentIdAndPsychologyIdParams = {
  appointmentId: UniqueEntityID
}

export abstract class AppointmentsRepository {
  abstract findManyByPsychologistId(
    filter: {
      status?: AppointmentStatuses
      period?: {
        from: Date
        to: Date
      }
    },
    params: PaginationParams,
    psychologistId: UniqueEntityID,
  ): Promise<Appointment[]>

  abstract findById(
    params: FindByAppointmentIdAndPsychologyIdParams,
  ): Promise<Appointment | null>

  abstract update(appointment: Appointment): Promise<void>
}
