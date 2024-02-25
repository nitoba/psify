import { Entity } from '@/core/entities/entity'

type UserProps = {
  name: string
  email: string
  password: string
}

export abstract class User extends Entity<UserProps> {}
