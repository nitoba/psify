import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { PatientRepository } from '@/domain/patient/application/repositories/patient-repository'
import { PsychologistRepository } from '@/domain/psychologist/application/repositories/psychology-repository'

import { Appointment } from '../../enterprise/entities/appointment'
import { AvailableTimeToSchedule } from '../../enterprise/entities/available-time-to-schedules'
import { AppointmentsRepository } from '../repositories/appointments-repository'

type RequestScheduleAppointmentUseCaseRequest = {
  psychologistId: string
  patientId: string
  scheduledTo: Date
}

type RequestScheduleAppointmentUseCaseResponse = Either<
  InvalidResource | ResourceNotFound,
  {
    appointment: Appointment
  }
>

@Injectable()
export class RequestScheduleAppointmentUseCase {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly psychologistRepository: PsychologistRepository,
    private readonly appointmentRepository: AppointmentsRepository,
  ) {}

  async execute({
    patientId,
    psychologistId,
    scheduledTo,
  }: RequestScheduleAppointmentUseCaseRequest): Promise<RequestScheduleAppointmentUseCaseResponse> {
    const psychologist =
      await this.psychologistRepository.findById(psychologistId)
    const patient = await this.patientRepository.findById(patientId)
    if (!psychologist || !patient) {
      return left(new ResourceNotFound('Psychologist or patient not found'))
    }

    // validate if patient is not already scheduled or this schedule are pending to the same psychologist
    const appointmentsScheduled =
      await this.appointmentRepository.findManyByPatientId(
        { statuses: ['pending', 'scheduled'] },
        { page: 1 },
        patient.id,
      )

    const isAlreadyScheduled = appointmentsScheduled.appointments.some((ap) =>
      ap.psychologistId.equals(psychologist.id),
    )

    if (isAlreadyScheduled) {
      return left(
        new InvalidResource('patient already scheduled to psychologist'),
      )
    }

    // validate if psychologist is available to schedule appointment
    const availableTimesToSchedules =
      AvailableTimeToSchedule.getAvailableTimesToSchedules(
        psychologist.getAvailableTimes(),
        psychologist.scheduledAppointments,
      )

    const isAvailable = availableTimesToSchedules.some((at) => {
      const [hourFromTime, minutesFromTime] = at.time.getHoursAndMinutes()

      const timeAvailableToSchedulesToDate = new Date(
        scheduledTo.getFullYear(),
        scheduledTo.getMonth(),
        scheduledTo.getDate(),
        hourFromTime,
        minutesFromTime,
      )

      return (
        scheduledTo.getTime() >= timeAvailableToSchedulesToDate.getTime() &&
        scheduledTo.getDay() === at.weekday
      )
    })

    if (!isAvailable) {
      return left(new InvalidResource('psychologist is not available'))
    }

    const appointment = Appointment.create({
      patientId: patient.id,
      psychologistId: psychologist.id,
      status: 'pending',
      costInCents: psychologist.consultationPriceInCents,
      scheduledTo,
    })

    await this.appointmentRepository.create(appointment)

    return right({
      appointment,
    })
  }
}
