import { Entity } from '@/core/entities/entity'

import { Email } from '../value-objects/email'
import { Name } from '../value-objects/name'
import { Phone } from '../value-objects/phone'

export type UserProps = {
  name: Name
  email: Email
  phone: Phone
  password: string
}

export abstract class User<Props> extends Entity<Props> {}
