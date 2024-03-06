import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { AppointmentsRepository } from '../repositories/appointments-repository'

type RejectAppointmentUseCaseRequest = {
  appointmentId: string
}

type RejectAppointmentUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

@Injectable()
export class RejectAppointmentUseCase {
  constructor(private readonly appointmentRepository: AppointmentsRepository) {}

  async execute({
    appointmentId,
  }: RejectAppointmentUseCaseRequest): Promise<RejectAppointmentUseCaseResponse> {
    const appointment = await this.appointmentRepository.findById(appointmentId)

    if (!appointment) {
      return left(new ResourceNotFound('Appointment not found!'))
    }

    const wasRejected = appointment.reject()

    if (wasRejected.isLeft()) {
      return left(wasRejected.value)
    }

    await this.appointmentRepository.save(appointment)

    return right(undefined)
  }
}
