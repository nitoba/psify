import { Controller, Param, Put } from '@nestjs/common'
import { z } from 'zod'

import { ApproveOrderUseCase } from '@/domain/payment/application/use-cases/approve-order'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const cancelScheduledAppointmentParamsSchema = z
  .string({ required_error: 'orderID is required!' })
  .uuid({ message: 'order id must be a uuid' })

const orderIdValidator = new ZodValidationPipe(
  cancelScheduledAppointmentParamsSchema,
)

@Controller('/orders/:orderId/approve')
export class ApproveOrderController {
  constructor(private readonly useCase: ApproveOrderUseCase) {}

  @Put()
  async handle(
    @Param('orderId', orderIdValidator)
    orderId: string,
  ) {
    console.log('ApproveOrderController.handle', orderId)
  }
}
