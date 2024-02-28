import { ValueObject } from '@/core/entities/value-objects'

type Source = 'credit_card' | 'pix'

type PaymentMethodProps = {
  value: Source
}

export class PaymentMethod extends ValueObject<PaymentMethodProps> {
  static create(props: PaymentMethodProps) {
    return new PaymentMethod(props)
  }
}
