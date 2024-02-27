import { differenceInDays } from 'date-fns'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import {
  Appointment,
  AppointmentStatuses,
} from '@/domain/schedules/enterprise/entities/appointment'

import { AppointmentsRepository } from '../../../schedules/application/repositories/appointments-repository'
import { PsychologistRepository } from '../repositories/psychology-repository'

type FetchScheduledAppointmentsUseCaseRequest = {
  psychologistId: string
  page: number
  status?: AppointmentStatuses
  period?: {
    from: Date
    to: Date
  }
}

type FetchScheduledAppointmentsUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  {
    scheduledAppointments: Appointment[]
  }
>

export class FetchScheduledAppointmentsUseCase {
  constructor(
    private readonly psychologistRepository: PsychologistRepository,
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    page,
    psychologistId,
    period,
    status,
  }: FetchScheduledAppointmentsUseCaseRequest): Promise<FetchScheduledAppointmentsUseCaseResponse> {
    const psychologist =
      await this.psychologistRepository.findById(psychologistId)

    if (!psychologist) {
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
      await this.appointmentsRepository.findManyByPsychologistId(
        {
          status,
          period,
        },
        { page },
        psychologistId,
      )

    return right({
      scheduledAppointments,
    })
  }
}
