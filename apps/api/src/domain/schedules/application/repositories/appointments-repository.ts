import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Repository } from '@/domain/core/application/repositories/repository'

import {
  Appointment,
  AppointmentStatuses,
} from '../../enterprise/entities/appointment'

export abstract class AppointmentsRepository extends Repository<Appointment> {
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
  ): Promise<{ appointments: Appointment[]; total: number }>

  abstract findManyByPatientId(
    filter: {
      statuses?: AppointmentStatuses[]
      period?: {
        from: Date
        to: Date
      }
    },
    params: PaginationParams,
    patientId: UniqueEntityID,
  ): Promise<{ appointments: Appointment[]; total: number }>

  abstract save(appointment: Appointment): Promise<void>
}
