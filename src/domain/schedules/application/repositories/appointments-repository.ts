import { PaginationParams } from '@/core/repositories/pagination-params'

import {
  Appointment,
  AppointmentStatuses,
} from '../../enterprise/entities/appointment'

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
    psychologistId: string,
  ): Promise<Appointment[]>
}
