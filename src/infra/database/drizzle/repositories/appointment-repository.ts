import { Injectable } from '@nestjs/common'
import { and, count, desc, eq, gte, inArray, lte } from 'drizzle-orm'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'
import {
  Appointment,
  AppointmentStatuses,
} from '@/domain/schedules/enterprise/entities/appointment'

import { DrizzleService } from '../drizzle.service'
import { toDomain } from '../mappers/appointment-mapper'
import { appointments } from '../schemas/appointment'

@Injectable()
export class DrizzleAppointmentRepository implements AppointmentsRepository {
  constructor(private drizzle: DrizzleService) {}
  async findManyByPsychologistId(
    filter: {
      status?: AppointmentStatuses
      period?: { from: Date; to: Date }
    },
    { page }: PaginationParams,
    psychologistId: UniqueEntityID,
  ): Promise<{ appointments: Appointment[]; total: number }> {
    const perPage = 10
    const offset = (page - 1) * perPage

    const baseQuery = this.drizzle.client
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.psychologistId, psychologistId.toString()),
          filter.status ? eq(appointments.status, filter.status) : undefined,
          filter.period
            ? and(
                gte(appointments.scheduledTo, new Date(filter.period.from)),
                lte(appointments.scheduledTo, new Date(filter.period.to)),
              )
            : undefined,
        ),
      )

    const [[appointmentsCount], scheduledAppointments] = await Promise.all([
      await this.drizzle.client
        .select({
          count: count(),
        })
        .from(baseQuery.as('baseQuery')),
      await baseQuery
        .offset(offset)
        .limit(perPage)
        .orderBy(desc(appointments.createdAt)),
    ])

    return {
      appointments: scheduledAppointments.map(toDomain),
      total: appointmentsCount.count,
    }
  }

  async findManyByPatientId(
    filter: {
      statuses?: AppointmentStatuses[]
      period?: { from: Date; to: Date }
    },
    { page }: PaginationParams,
    patientId: UniqueEntityID,
  ): Promise<{
    appointments: Appointment[]
    total: number
  }> {
    const perPage = 10
    const offset = (page - 1) * perPage
    const baseQuery = this.drizzle.client
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.patientId, patientId.toString()),
          filter.statuses?.length
            ? inArray(appointments.status, filter.statuses)
            : undefined,
          filter.period
            ? and(
                gte(appointments.scheduledTo, new Date(filter.period.from)),
                lte(appointments.scheduledTo, new Date(filter.period.to)),
              )
            : undefined,
        ),
      )

    const [[appointmentsCount], scheduledAppointments] = await Promise.all([
      await this.drizzle.client
        .select({
          count: count(),
        })
        .from(baseQuery.as('baseQuery')),
      await baseQuery
        .offset(offset)
        .limit(perPage)
        .orderBy(desc(appointments.createdAt)),
    ])

    return {
      appointments: scheduledAppointments.map(toDomain),
      total: appointmentsCount.count,
    }
  }

  async save(appointment: Appointment): Promise<void> {
    await this.drizzle.client
      .update(appointments)
      .set({
        patientId: appointment.patientId.toString(),
        psychologistId: appointment.psychologistId.toString(),
        scheduledTo: appointment.scheduledTo,
        status: appointment.status,
        costInCents: appointment.costInCents,
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, appointment.id.toString()))
      .execute()
  }

  async create(entity: Appointment): Promise<void> {
    await this.drizzle.client.insert(appointments).values({
      id: entity.id.toString(),
      patientId: entity.patientId.toString(),
      psychologistId: entity.psychologistId.toString(),
      scheduledTo: entity.scheduledTo,
      status: entity.status,
      costInCents: entity.costInCents,
      createdAt: entity.createdAt,
    })
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.drizzle.client.query.appointments.findFirst({
      where: (a, { eq }) => eq(a.id, id),
    })

    if (!appointment) return null

    return toDomain(appointment)
  }
}
