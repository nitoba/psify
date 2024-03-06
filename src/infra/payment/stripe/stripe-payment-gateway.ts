import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'

import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { PaymentGateway } from '@/domain/payment/application/gateway/payment-gateway'
import { Order } from '@/domain/payment/enterprise/entities/order'

import { MODULE_OPTIONS_TOKEN } from './stripe.module-definitions'
import { StripeModuleOptions } from './stripe-options'

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  private readonly stripe: Stripe
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: StripeModuleOptions,
    private readonly patientRepository: AuthPatientRepository,
  ) {
    this.stripe = new Stripe(this.options.apiKey, this.options.options)
  }

  async requestPayment(order: Order): Promise<string | null> {
    const costumer = await this.findCostumerById(order.costumerId.toString())

    if (!costumer) return null

    const checkoutSession = await this.stripe.checkout.sessions.create({
      customer: costumer.costumerId,
      currency: 'BRL',
      success_url: `https://google.com`,
      mode: 'payment',
      metadata: {
        sellerId: order.sellerId.toString(),
        costumerId: order.costumerId.toString(),
        orderId: order.id.toString(),
      },
      payment_method_types: [order.paymentMethod.value],
      line_items: order.orderItems.map((orderItem) => ({
        quantity: orderItem.quantity,
        price_data: {
          currency: 'BRL',
          product_data: {
            name: orderItem.name,
            description: `Consultation with psychologist`,
          },
          unit_amount: orderItem.priceInCents,
        },
      })),
    })

    return checkoutSession.url
  }

  async pay(order: Order): Promise<void> {
    console.log('StripePaymentGateway.pay', order)
    throw new Error('Method not implemented.')
  }

  private async findCostumerById(costumerId: string) {
    const patient = await this.patientRepository.findById(costumerId)

    if (!patient) return null

    const costumer = await this.stripe.customers.search({
      query: `email:'${patient.email}'`,
    })

    if (costumer.data.length > 0) {
      return {
        costumerId: costumer.data[0].id,
      }
    }

    const newCostumerCreated = await this.stripe.customers.create({
      email: patient.email,
      name: patient.name,
      phone: patient.phone,
      metadata: {
        costumerId: patient?.id.toString(),
      },
    })

    return {
      costumerId: newCostumerCreated.id,
    }
  }
}
