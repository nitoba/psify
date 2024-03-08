import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Patient,
  PatientProps,
} from '@/domain/auth/enterprise/entities/patient'
import {
  Psychologist,
  PsychologistProps,
} from '@/domain/auth/enterprise/entities/psychologist'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { faker } from '@faker-js/faker'
import { randomNumbers } from 'test/utils/random-numbers'

export function makeAuthPatientOrPsychologist(
  override: Partial<PatientProps> & Partial<PsychologistProps> = {},
  id?: UniqueEntityID,
) {
  if (override.crp) {
    const psychologist = Psychologist.create(
      {
        name: Name.create(faker.person.fullName()).value as Name,
        email: Email.create(faker.internet.email()).value as Email,
        phone: Phone.create('(88) 987654321').value as Phone,
        password: faker.internet.password(),
        crp: CRP.create(String(randomNumbers(7))).value as CRP,
        ...override,
      },
      id,
    )

    return psychologist
  }

  const patient = Patient.create(
    {
      name: Name.create(faker.person.fullName()).value as Name,
      email: Email.create(faker.internet.email()).value as Email,
      phone: Phone.create('(88) 987654321').value as Phone,
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
  return patient
}
