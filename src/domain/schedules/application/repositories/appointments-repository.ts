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
  ): Promise<Appointment[]>

  abstract findManyByPatientId(
    filter: {
      status?: AppointmentStatuses
      period?: {
        from: Date
        to: Date
      }
    },
    params: PaginationParams,
    patientId: UniqueEntityID,
  ): Promise<Appointment[]>

  abstract save(appointment: Appointment): Promise<void>
}
