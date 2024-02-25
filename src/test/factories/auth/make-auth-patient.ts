import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Patient,
  PatientProps,
} from '@/domain/auth/enterprise/entities/patient'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'

export function makeAuthPatient(
  override: Partial<PatientProps> = {},
  id?: UniqueEntityID,
) {
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
