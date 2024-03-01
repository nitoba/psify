import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Psychologist,
  PsychologistProps,
} from '@/domain/auth/enterprise/entities/psychologist'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'

export function makeAuthPsychologist(
  override: Partial<PsychologistProps> = {},
  id?: UniqueEntityID,
) {
  const psychologist = Psychologist.create(
    {
      name: Name.create(faker.person.fullName()).value as Name,
      email: Email.create(faker.internet.email()).value as Email,
      phone: Phone.create('(88) 987654321').value as Phone,
      password: faker.internet.password(),
      crp: CRP.create('12345678901234').value as CRP,
      ...override,
    },
    id,
  )
  return psychologist
}
