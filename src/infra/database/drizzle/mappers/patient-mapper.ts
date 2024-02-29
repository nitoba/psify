import { InferSelectModel } from 'drizzle-orm'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Patient } from '@/domain/auth/enterprise/entities/patient'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'

import { patient } from '../schemas/patient'

export function toAuthDomain(model: InferSelectModel<typeof patient>): Patient {
  const p = Patient.create(
    {
      name: Name.create(model.name).value as Name,
      email: Email.create(model.email).value as Email,
      password: model.password,
      phone: Phone.create(model.phone).value as Phone,
      createdAt: model.createdAt,
    },
    new UniqueEntityID(model.id),
  )
  return p
}
