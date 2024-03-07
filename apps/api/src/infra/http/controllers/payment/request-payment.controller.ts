import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { RequestPaymentUseCase } from '@/domain/payment/application/use-cases/request-payment'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/decorators/roles-decorator'
import { RolesGuard } from '@/infra/auth/guards/roles-guard'
import { Role } from '@/infra/auth/roles'

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
  @Roles(Role.Patient)
  @UseGuards(RolesGuard)
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
