import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HashGenerator } from '@/domain/auth/application/cryptography/hash-generator'
import {
  Psychologist,
  PsychologistProps,
} from '@/domain/auth/enterprise/entities/psychologist'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'
import { psychologist } from '@/infra/database/drizzle/schemas/psychologist'

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
      crp: CRP.create('1234567').value as CRP,
      ...override,
    },
    id,
  )
  return psychologist
}

@Injectable()
export class AuthPsychologistFactory {
  constructor(
    private drizzle: DrizzleService,
    private hasher: HashGenerator,
  ) {}

  async makeDbPsychologist(override: Partial<PsychologistProps> = {}) {
    const p = makeAuthPsychologist(override)

    const [psychologistDB] = await this.drizzle.client
      .insert(psychologist)
      .values({
        id: p.id.toString(),
        name: p.name,
        email: p.email,
        password: await this.hasher.hash(p.password),
        phone: p.phone,
        authUserId: randomUUID(),
        crp: p.crp.value,
        specialties: [],
      })
      .returning()

    return psychologistDB
  }
}
