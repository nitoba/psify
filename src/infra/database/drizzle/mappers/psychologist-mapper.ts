import { InferSelectModel } from 'drizzle-orm'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Psychologist } from '@/domain/auth/enterprise/entities/psychologist'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'

import { psychologist } from '../schemas/psychologist'

export function toAuthDomain(
  model: InferSelectModel<typeof psychologist>,
): Psychologist {
  const p = Psychologist.create(
    {
      name: Name.create(model.name).value as Name,
      email: Email.create(model.email).value as Email,
      password: model.password,
      crp: CRP.create(model.crp).value as CRP,
      phone: Phone.create(model.phone).value as Phone,
      createdAt: model.createdAt,
    },
    new UniqueEntityID(model.id),
  )
  return p
}
