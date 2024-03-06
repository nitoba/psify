import { BadRequestException, Controller, Param, Post } from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
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
    const result = await this.useCase.execute({
      orderId,
    })
    if (
      result.isLeft() &&
      (result.value instanceof ResourceNotFound ||
        result.value instanceof InvalidResource)
    ) {
      throw new BadRequestException(result.value)
    }

    if (result.isRight()) {
      return {
        paymentUrl: result.value.paymentUrl,
      }
    }
  }
}
