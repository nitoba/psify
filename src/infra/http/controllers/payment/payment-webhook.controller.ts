import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'

import { ApproveOrderUseCase } from '@/domain/payment/application/use-cases/approve-order'
import { CancelOrderUseCase } from '@/domain/payment/application/use-cases/cancel-order'
import { Public } from '@/infra/auth/decorators/public'
import { StripeWebhookGuard } from '@/infra/payment/guards/stripe-webhook-guard'
import { WebHookBody } from '@/infra/payment/stripe/stripe-options'

@Controller('/orders/webhooks')
export class PaymentWebhookController {
  constructor(
    private readonly approveOrderUseCase: ApproveOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  @Public()
  @Post()
  @UseGuards(StripeWebhookGuard)
  async handle(@Body() { type, data }: WebHookBody) {
    switch (type) {
      case 'payment_intent.succeeded': {
        const { orderId } = data.object.metadata
        const result = await this.approveOrderUseCase.execute({ orderId })

        if (result.isLeft()) {
          throw new BadRequestException(result.value)
        }
        break
      }
      case 'payment_intent.canceled': {
        const { orderId } = data.object.metadata
        const result = await this.cancelOrderUseCase.execute({ orderId })

        if (result.isLeft()) {
          throw new BadRequestException(result.value)
        }
        break
      }
      default:
        console.log(`Unhandled event type ${type}`)
    }

    return {
      message: 'webhook payment received!',
    }
  }
}
