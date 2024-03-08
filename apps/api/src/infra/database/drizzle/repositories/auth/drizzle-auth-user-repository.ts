import { AuthUserRepository } from '@/domain/auth/application/repositories/auth-user-repository'
import { DrizzleService } from '../../drizzle.service'
import { Patient } from '@/domain/auth/enterprise/entities/patient'
import { Psychologist } from '@/domain/auth/enterprise/entities/psychologist'
import { toAuthDomain as toAuthPatientDomain } from '../../mappers/patient-mapper'
import { toAuthDomain as toAuthPsychologistDomain } from '../../mappers/psychologist-mapper'
import { accounts, users } from '../../schemas/auth'
import { randomUUID } from 'node:crypto'
import { patient } from '../../schemas/patient'
import { psychologist } from '../../schemas'
import { eq } from 'drizzle-orm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DrizzleAuthUserRepository implements AuthUserRepository {
  constructor(private readonly db: DrizzleService) {}
  async findByEmail(email: string): Promise<Patient | Psychologist | null> {
    const user = await this.db.client.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    })

    if (!user) return null

    if (user.role === 'patient') {
      const patient = await this.db.client.query.patient.findFirst({
        where: ({ authUserId }, { eq }) => eq(authUserId, user.id),
      })

      if (!patient) return null

      return toAuthPatientDomain(patient)
    }
    if (user.role === 'psychologist') {
      const psychologist = await this.db.client.query.psychologist.findFirst({
        where: ({ authUserId }, { eq }) => eq(authUserId, user.id),
      })

      if (!psychologist) return null

      return toAuthPsychologistDomain(psychologist)
    }

    return null
  }

  async save(entity: Patient | Psychologist): Promise<void> {
    const isAPatient = entity instanceof Patient

    if (isAPatient) {
      await this.db.client
        .update(patient)
        .set({
          name: entity.name,
          email: entity.email,
          password: entity.password,
          phone: entity.phone,
          updatedAt: new Date(),
        })
        .where(eq(patient.id, entity.id.toString()))
    } else {
      await this.db.client
        .update(psychologist)
        .set({
          name: entity.name,
          email: entity.email,
          password: entity.password,
          phone: entity.phone,
          crp: entity.crp.value,
          updatedAt: new Date(),
        })
        .where(eq(psychologist.id, entity.id.toString()))
    }
  }

  async create(entity: Patient | Psychologist): Promise<void> {
    const isAPatient = entity instanceof Patient
    const role = isAPatient ? 'patient' : 'psychologist'
    await this.db.client.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: entity.email,
          name: entity.name,
          role,
        })
        .returning()

      await tx.insert(accounts).values({
        provider: 'credentials',
        type: 'email',
        userId: user.id,
        providerAccountId: randomUUID(),
      })

      if (isAPatient) {
        await tx.insert(patient).values({
          id: entity.id.toString(),
          name: entity.name,
          email: entity.email,
          password: entity.password,
          phone: entity.phone,
          createdAt: entity.createdAt,
          authUserId: user.id,
        })
      } else {
        await tx.insert(psychologist).values({
          id: entity.id.toString(),
          name: entity.name,
          email: entity.email,
          crp: entity.crp.value,
          specialties: [],
          consultationPriceInCents: 0,
          password: entity.password,
          phone: entity.phone,
          createdAt: entity.createdAt,
          authUserId: user.id,
        })
      }
    })
  }

  async findById(id: string): Promise<Patient | Psychologist | null> {
    const user = await this.db.client.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    })

    if (!user) return null

    if (user.role === 'patient') {
      const patient = await this.db.client.query.patient.findFirst({
        where: ({ authUserId }, { eq }) => eq(authUserId, user.id),
      })

      if (!patient) return null

      return toAuthPatientDomain(patient)
    }
    if (user.role === 'psychologist') {
      const psychologist = await this.db.client.query.psychologist.findFirst({
        where: ({ authUserId }, { eq }) => eq(authUserId, user.id),
      })

      if (!psychologist) return null

      return toAuthPsychologistDomain(psychologist)
    }

    return null
  }
}
