import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { RequestScheduleAppointmentUseCase } from '@/domain/schedules/application/use-cases/request-schedule-appointment'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

@Controller('/appointments')
export class RequestScheduleAppointmentController {
  constructor(private useCase: RequestScheduleAppointmentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@CurrentUser() patient: PayloadUser) {
    const patientId = patient.sub

    const result = await this.useCase.execute({
      patientId,
      psychologistId: '1',
      scheduledTo: new Date(),
    })
  }
}
