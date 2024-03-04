import { Controller, Param, Put } from '@nestjs/common'
import { z } from 'zod'

import { CancelOrderUseCase } from '@/domain/payment/application/use-cases/cancel-order'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const cancelScheduledAppointmentParamsSchema = z
  .string({ required_error: 'orderID is required!' })
  .uuid({ message: 'order id must be a uuid' })

const orderIdValidator = new ZodValidationPipe(
  cancelScheduledAppointmentParamsSchema,
)

@Controller('/orders/:orderId/cancel')
export class CancelOrderController {
  constructor(private readonly useCase: CancelOrderUseCase) {}

  @Put()
  async handle(@Param('orderId', orderIdValidator) orderId: string) {
    console.log('CancelOrderController.handle', orderId)
  }
}
