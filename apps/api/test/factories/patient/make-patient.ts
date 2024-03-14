import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import {
  Patient,
  PatientProps,
} from '@/domain/patient/enterprise/entities/patient'

export function makePatient(
  override: Partial<PatientProps> = {},
  id?: UniqueEntityID,
) {
  const patient = Patient.create(
    {
      name: Name.create(faker.person.fullName()).value as Name,
      email: Email.create(faker.internet.email()).value as Email,
      phone: Phone.create('(88) 987654321').value as Phone,
      avatarUrl: faker.image.avatar(),
      scheduledAppointments: [],
      ...override,
    },
    id,
  )
  return patient
}
