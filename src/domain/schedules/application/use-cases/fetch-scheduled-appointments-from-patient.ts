import { differenceInDays } from 'date-fns'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { PatientRepository } from '@/domain/patient/application/repositories/patient-repository'
import {
  Appointment,
  AppointmentStatuses,
} from '@/domain/schedules/enterprise/entities/appointment'

import { AppointmentsRepository } from '../repositories/appointments-repository'

type FetchScheduledAppointmentsFromPatientUseCaseRequest = {
  patientId: string
  page: number
  status?: AppointmentStatuses
  period?: {
    from: Date
    to: Date
  }
}

type FetchScheduledAppointmentsFromPatientUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  {
    scheduledAppointments: Appointment[]
  }
>

export class FetchScheduledAppointmentsFromPatientUseCase {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    page,
    patientId,
    period,
    status,
  }: FetchScheduledAppointmentsFromPatientUseCaseRequest): Promise<FetchScheduledAppointmentsFromPatientUseCaseResponse> {
    const patient = await this.patientRepository.findById(
      new UniqueEntityID(patientId),
    )

    if (!patient) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    // validate if period has a valid dates
    if (period) {
      const isValidPeriod =
        period.to < new Date() && differenceInDays(period.to, period.from) <= 7

      if (!isValidPeriod) {
        return left(
          new InvalidResource('Period must be less than or equal to 7 days'),
        )
      }
    }

    const scheduledAppointments =
      await this.appointmentsRepository.findManyByPatientId(
        {
          status,
          period,
        },
        { page },
        patient.id,
      )

    return right({
      scheduledAppointments,
    })
  }
}
