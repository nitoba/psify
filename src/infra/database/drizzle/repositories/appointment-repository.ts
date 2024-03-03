import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'

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
  ): Promise<Appointment[]> {
    const perPage = 10
    const offset = (page - 1) * perPage
    const appointments = await this.drizzle.client.query.appointments.findMany({
      where: (a, { eq, and, gte, lte }) =>
        and(
          eq(a.patientId, psychologistId.toString()),
          filter.status ? eq(a.status, filter.status) : undefined,
          filter.period
            ? and(
                gte(a.scheduledTo, filter.period.from),
                lte(a.scheduledTo, filter.period.to),
              )
            : undefined,
        ),
      limit: perPage,
      offset,
    })

    return appointments.map(toDomain)
  }

  async findManyByPatientId(
    filter: {
      status?: AppointmentStatuses
      period?: { from: Date; to: Date }
    },
    { page }: PaginationParams,
    patientId: UniqueEntityID,
  ): Promise<Appointment[]> {
    const perPage = 10
    const offset = (page - 1) * perPage
    const appointments = await this.drizzle.client.query.appointments.findMany({
      where: (a, { eq, and, gte, lte }) =>
        and(
          eq(a.patientId, patientId.toString()),
          filter.status ? eq(a.status, filter.status) : undefined,
          filter.period
            ? and(
                gte(a.scheduledTo, filter.period.from),
                lte(a.scheduledTo, filter.period.to),
              )
            : undefined,
        ),
      limit: perPage,
      offset,
    })

    return appointments.map(toDomain)
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
