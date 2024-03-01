import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HashGenerator } from '@/domain/auth/application/cryptography/hash-generator'
import {
  Patient,
  PatientProps,
} from '@/domain/auth/enterprise/entities/patient'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'
import { patient } from '@/infra/database/drizzle/schemas/patient'

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

@Injectable()
export class AuthPatientFactory {
  constructor(
    private drizzle: DrizzleService,
    private hasher: HashGenerator,
  ) {}

  async makeDbPatient(override: Partial<PatientProps> = {}) {
    const p = makeAuthPatient(override)

    const [patientDB] = await this.drizzle.client
      .insert(patient)
      .values({
        id: p.id.toString(),
        name: p.name,
        email: p.email,
        password: await this.hasher.hash(p.password),
        phone: p.phone,
        authUserId: randomUUID(),
      })
      .returning()

    return patientDB
  }
}
