import Stripe from 'stripe'

export interface StripeModuleOptions {
  apiKey: string
  options: Stripe.StripeConfig
}

export type WebHookBody = Stripe.Event
