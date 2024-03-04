import { Controller, Param, Post } from '@nestjs/common'
import { z } from 'zod'

import { RequestPaymentUseCase } from '@/domain/payment/application/use-cases/request-payment'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const cancelScheduledAppointmentParamsSchema = z
  .string({ required_error: 'orderID is required!' })
  .uuid({ message: 'order id must be a uuid' })

const orderIdValidator = new ZodValidationPipe(
  cancelScheduledAppointmentParamsSchema,
)

@Controller('/orders/:orderId/payment')
export class RequestOrderPaymentController {
  constructor(private readonly useCase: RequestPaymentUseCase) {}

  @Post()
  async handle(@Param('orderId', orderIdValidator) orderId: string) {
    console.log('RequestOrderPaymentController.handle', orderId)
  }
}
