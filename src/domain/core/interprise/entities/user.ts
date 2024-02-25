import { Entity } from '@/core/entities/entity'

import { Email } from '../value-objects/email'
import { Name } from '../value-objects/name'

type UserProps = {
  name: Name
  email: Email
  password: string
}

export abstract class User extends Entity<UserProps> {}
