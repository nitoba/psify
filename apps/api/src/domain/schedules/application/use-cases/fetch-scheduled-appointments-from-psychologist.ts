import { Injectable } from '@nestjs/common'
import { differenceInDays } from 'date-fns'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import {
  Appointment,
  AppointmentStatuses,
} from '@/domain/schedules/enterprise/entities/appointment'

import { PsychologistRepository } from '../../../psychologist/application/repositories/psychology-repository'
import { AppointmentsRepository } from '../repositories/appointments-repository'

type FetchScheduledAppointmentsFromPsychologistUseCaseRequest = {
  psychologistId: string
  page: number
  status?: AppointmentStatuses
  period?: {
    from: Date
    to: Date
  }
}

type FetchScheduledAppointmentsFromPsychologistUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  {
    scheduledAppointments: Appointment[]
    total: number
  }
>

@Injectable()
export class FetchScheduledAppointmentsFromPsychologistUseCase {
  constructor(
    private readonly psychologistRepository: PsychologistRepository,
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    page,
    psychologistId,
    period,
    status,
  }: FetchScheduledAppointmentsFromPsychologistUseCaseRequest): Promise<FetchScheduledAppointmentsFromPsychologistUseCaseResponse> {
    const psychologist =
      await this.psychologistRepository.findById(psychologistId)

    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    // validate if period has a valid dates
    if (period) {
      const diffInDays = differenceInDays(period.to, period.from)
      const isInvalidPeriod = diffInDays < 0 || diffInDays > 7

      if (isInvalidPeriod) {
        return left(
          new InvalidResource('Period must be less than or equal to 7 days'),
        )
      }
    }

    const { appointments, total } =
      await this.appointmentsRepository.findManyByPsychologistId(
        {
          status,
          period,
        },
        { page },
        psychologist.id,
      )

    return right({
      scheduledAppointments: appointments,
      total,
    })
  }
}
