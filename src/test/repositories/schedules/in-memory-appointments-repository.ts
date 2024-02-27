import { differenceInDays } from 'date-fns'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'
import {
  Appointment,
  AppointmentStatuses,
} from '@/domain/schedules/enterprise/entities/appointment'

export class InMemoryAppointmentsRepository implements AppointmentsRepository {
  appointments: Appointment[] = []

  async findManyByPsychologistId(
    filter: {
      status?: AppointmentStatuses | undefined
      period?: { from: Date; to: Date } | undefined
    },
    { page }: PaginationParams,
    psychologistId: string,
  ): Promise<Appointment[]> {
    const offset = (page - 1) * 10

    const appointmentsFromPsychologist = this.appointments.filter((ap) => {
      if (!filter.period && !filter.status) {
        return (
          differenceInDays(new Date(), ap.scheduledTo) <= 7 &&
          ap.psychologistId.toString() === psychologistId
        )
      }

      if (!filter.period && filter.status) {
        return (
          ap.status === filter.status &&
          differenceInDays(new Date(), ap.scheduledTo) <= 7 &&
          ap.psychologistId.toString() === psychologistId
        )
      }

      // scheduled to: 12-03-2024
      // from: 10-03-2024
      // to: 17-03-2024
      if (!filter.status && filter.period) {
        return (
          ap.scheduledTo > filter.period.from &&
          ap.scheduledTo < filter.period.to &&
          ap.psychologistId.toString() === psychologistId
        )
      }

      return false
    })

    return appointmentsFromPsychologist.slice(offset, offset + 10)
  }
}
