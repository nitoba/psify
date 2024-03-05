import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { AppointmentsRepository } from '../repositories/appointments-repository'

type ApproveAppointmentUseCaseRequest = {
  appointmentId: string
}

type ApproveAppointmentUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

@Injectable()
export class ApproveAppointmentUseCase {
  constructor(private readonly appointmentRepository: AppointmentsRepository) {}

  async execute({
    appointmentId,
  }: ApproveAppointmentUseCaseRequest): Promise<ApproveAppointmentUseCaseResponse> {
    const appointment = await this.appointmentRepository.findById(appointmentId)

    if (!appointment) {
      return left(new ResourceNotFound('Appointment not found!'))
    }

    const wasApproved = appointment.approve()

    if (wasApproved.isLeft()) {
      return left(wasApproved.value)
    }

    await this.appointmentRepository.save(appointment)

    return right(undefined)
  }
}
