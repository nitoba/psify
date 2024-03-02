import { Injectable } from '@nestjs/common'
import { sql } from 'drizzle-orm'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { PsychologistRepository } from '@/domain/psychologist/application/repositories/psychology-repository'
import { AvailableTimesList } from '@/domain/psychologist/enterprise/entities/available-times-list'
import { Psychologist } from '@/domain/psychologist/enterprise/entities/psychologist'
import { SpecialtyList } from '@/domain/psychologist/enterprise/entities/specialty-list'

import { DrizzleService } from '../drizzle.service'
import { toDomain } from '../mappers/psychologist-mapper'

@Injectable()
export class DrizzlePsychologistRepository implements PsychologistRepository {
  constructor(private drizzle: DrizzleService) {}

  update(psychologist: Psychologist): Promise<void> {
    throw new Error('Method not implemented.')
  }

  updateSpecialties(specialties: SpecialtyList, id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  updateAvailableTimes(
    availableTimes: AvailableTimesList,
    id: string,
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findMany(
    filter: { name?: string; specialties?: string[] },
    { page }: PaginationParams,
  ): Promise<Psychologist[]> {
    const perPage = 10
    const offset = (page - 1) * perPage
    const psychologists = await this.drizzle.client.query.psychologist.findMany(
      {
        where:
          !filter.name && !filter.specialties
            ? undefined
            : ({ name, specialties }, { ilike, sql, and }) => {
                if (filter.name && !filter.specialties) {
                  return ilike(name, `%${filter.name}%`)
                }

                if (!filter.name && filter.specialties) {
                  const params = `{${filter.specialties.map((v) => `"${v.toLowerCase()}"`).join(', ')}}`

                  return sql`(SELECT ARRAY(SELECT LOWER(unnest(${specialties})))) @> ${params}`
                }

                if (filter.name && filter.specialties) {
                  const params = `{${filter.specialties.map((v) => `"${v.toLowerCase()}"`).join(', ')}}`
                  return and(
                    ilike(name, `%${filter.name}%`),
                    sql`(SELECT ARRAY(SELECT LOWER(unnest(${specialties})))) @> ${params}`,
                  )
                }
              },
        limit: perPage,
        offset,
        with: {
          availableTimes: true,
          scheduledAppointments: true,
        },
      },
    )

    return psychologists.map(toDomain)
  }

  async create(entity: Psychologist) {
    console.log(entity)
  }

  async findById(id: string): Promise<Psychologist | null> {
    const psychologist = await this.drizzle.client.query.psychologist.findFirst(
      {
        where: (p, { eq }) => eq(p.id, id),
        with: {
          availableTimes: true,
          scheduledAppointments: true,
        },
      },
    )

    if (!psychologist) return null

    return toDomain(psychologist)
  }
}
