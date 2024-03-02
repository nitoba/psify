import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import { Psychologist } from '@/domain/auth/enterprise/entities/psychologist'

import { DrizzleService } from '../../drizzle.service'
import { toAuthDomain } from '../../mappers/psychologist-mapper'
import { accounts, psychologist, users } from '../../schemas'

@Injectable()
export class DrizzleAuthPsychologistRepository
  implements AuthPsychologistRepository
{
  constructor(private readonly db: DrizzleService) {}

  async findByEmail(email: string): Promise<Psychologist | null> {
    const result = await this.db.client.query.psychologist.findFirst({
      where: (psychologist, { eq }) => eq(psychologist.email, email),
    })

    if (!result) return null

    return toAuthDomain(result)
  }

  async create(entity: Psychologist): Promise<void> {
    // TODO: execute with transactions
    const [user] = await this.db.client
      .insert(users)
      .values({
        email: entity.email,
        name: entity.name,
      })
      .returning()

    await this.db.client.insert(accounts).values({
      provider: 'credentials',
      type: 'email',
      userId: user.id,
      providerAccountId: randomUUID(),
    })

    await this.db.client.insert(psychologist).values({
      id: entity.id.toString(),
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      crp: entity.crp.value,
      password: entity.password,
      authUserId: user.id,
      specialties: [],
      consultationPriceInCents: 0,
    })
  }

  async findById(id: string): Promise<Psychologist | null> {
    const result = await this.db.client.query.psychologist.findFirst({
      where: (psychologist, { eq }) => eq(psychologist.id, id),
    })

    if (!result) return null

    return toAuthDomain(result)
  }
}
