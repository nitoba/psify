import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { Patient } from '@/domain/auth/enterprise/entities/patient'

import { DrizzleService } from '../drizzle.service'
import { toAuthDomain } from '../mappers/patient-mapper'
import { accounts, patient, users } from '../schemas'

@Injectable()
export class DrizzleAuthPatientRepository implements AuthPatientRepository {
  constructor(private readonly db: DrizzleService) {}

  async findByEmail(email: string): Promise<Patient | null> {
    const result = await this.db.client.query.patient.findFirst({
      where: (patient, { eq }) => eq(patient.email, email),
    })

    if (!result) return null

    return toAuthDomain(result)
  }

  async create(entity: Patient): Promise<void> {
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

    await this.db.client.insert(patient).values({
      id: entity.id.toString(),
      name: entity.name,
      email: entity.email,
      password: entity.password,
      phone: entity.phone,
      createdAt: entity.createdAt,
      authUserId: user.id,
    })
  }

  async findById(id: string): Promise<Patient | null> {
    const result = await this.db.client.query.patient.findFirst({
      where: (patient, { eq }) => eq(patient.id, id),
    })

    if (!result) return null

    return toAuthDomain(result)
  }
}
