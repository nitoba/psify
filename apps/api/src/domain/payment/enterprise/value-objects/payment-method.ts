import { ValueObject } from '@/core/entities/value-objects'

export type Source = 'card' | 'pix'

export type PaymentMethodProps = {
  value: Source
}

export class PaymentMethod extends ValueObject<PaymentMethodProps> {
  static create(props: PaymentMethodProps) {
    return new PaymentMethod(props)
  }

  get value(): Source {
    return this.props.value
  }
}
