import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { randomNumbers } from 'test/utils/random-numbers'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HashGenerator } from '@/domain/auth/application/cryptography/hash-generator'
import {
  Psychologist,
  PsychologistProps as AuthProps,
} from '@/domain/auth/enterprise/entities/psychologist'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { PsychologistProps } from '@/domain/psychologist/enterprise/entities/psychologist'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'
import { psychologist } from '@/infra/database/drizzle/schemas/psychologist'
import { users } from '@/infra/database/drizzle/schemas/auth'

export function makeAuthPsychologist(
  override: Partial<AuthProps> = {},
  id?: UniqueEntityID,
) {
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

@Injectable()
export class AuthPsychologistFactory {
  constructor(
    private drizzle: DrizzleService,
    private hasher: HashGenerator,
  ) {}

  async makeDbPsychologist(
    override: Partial<PsychologistProps & Pick<AuthProps, 'password'>> = {},
  ) {
    const p = makeAuthPsychologist(override)

    const [user] = await this.drizzle.client
      .insert(users)
      .values({
        email: p.email,
        name: p.name,
        role: 'psychologist',
      })
      .returning()

    const [psychologistDB] = await this.drizzle.client
      .insert(psychologist)
      .values({
        id: p.id.toString(),
        name: p.name,
        email: p.email,
        password: await this.hasher.hash(p.password),
        phone: p.phone,
        authUserId: user.id,
        crp: p.crp.value,
        avatarUrl: faker.image.avatar(),
        bio: faker.lorem.sentence(20),
        consultationPriceInCents:
          override.consultationPriceInCents ?? 100 * 100, // 100 moneys
        specialties:
          override.specialties?.currentItems.map((s) => s.value) ?? [],
      })
      .returning()

    return psychologistDB
  }
}
