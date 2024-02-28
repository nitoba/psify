import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { AvailableTimesList } from '@/domain/psychologist/enterprise/entities/available-times-list'
import {
  Psychologist,
  PsychologistProps,
} from '@/domain/psychologist/enterprise/entities/psychologist'
import { SpecialtyList } from '@/domain/psychologist/enterprise/entities/specialty-list'

export function makePsychologist(
  override: Partial<PsychologistProps> = {},
  id?: UniqueEntityID,
) {
  const psychologist = Psychologist.create(
    {
      name: Name.create(faker.person.fullName()).value as Name,
      email: Email.create(faker.internet.email()).value as Email,
      phone: Phone.create('(88) 987654321').value as Phone,
      availableTimes: new AvailableTimesList([]),
      specialties: new SpecialtyList([]),
      scheduledAppointments: [],
      crp: CRP.create('12345678901234').value as CRP,
      ...override,
    },
    id,
  )
  return psychologist
}
