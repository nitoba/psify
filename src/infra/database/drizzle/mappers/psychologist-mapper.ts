import { InferSelectModel } from 'drizzle-orm'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Psychologist as AuthPsychologist } from '@/domain/auth/enterprise/entities/psychologist'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { AvailableTime } from '@/domain/psychologist/enterprise/entities/available-time'
import { AvailableTimesList } from '@/domain/psychologist/enterprise/entities/available-times-list'
import { Psychologist } from '@/domain/psychologist/enterprise/entities/psychologist'
import { SpecialtyList } from '@/domain/psychologist/enterprise/entities/specialty-list'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { Specialty } from '@/domain/psychologist/enterprise/value-objects/specialty'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'
import {
  Appointment,
  AppointmentStatuses,
} from '@/domain/schedules/enterprise/entities/appointment'

import { appointments } from '../schemas'
import { availableTimes, psychologist } from '../schemas/psychologist'

export function toAuthDomain(
  model: InferSelectModel<typeof psychologist>,
): AuthPsychologist {
  const p = AuthPsychologist.create(
    {
      name: Name.create(model.name).value as Name,
      email: Email.create(model.email).value as Email,
      password: model.password,
      crp: CRP.create(model.crp).value as CRP,
      phone: Phone.create(model.phone).value as Phone,
      createdAt: model.createdAt,
    },
    new UniqueEntityID(model.id),
  )
  return p
}

type PsychologistModel = InferSelectModel<typeof psychologist> & {
  availableTimes: InferSelectModel<typeof availableTimes>[]
  scheduledAppointments: InferSelectModel<typeof appointments>[]
}

export function toDomain(model: PsychologistModel): Psychologist {
  const availableTimes = model.availableTimes.map((availableTime) => {
    return AvailableTime.create({
      psychologistId: new UniqueEntityID(availableTime.psychologistId),
      time: Time.create(availableTime.time).value as Time,
      weekday: availableTime.weekday,
    })
  })

  const specialties = model.specialties.map((specialty) => {
    return Specialty.create(specialty).value as Specialty
  })

  const scheduledAppointments = model.scheduledAppointments.map(
    (appointment) => {
      return Appointment.create(
        {
          patientId: new UniqueEntityID(appointment.patientId),
          psychologistId: new UniqueEntityID(appointment.psychologistId),
          scheduledTo: appointment.scheduledTo,
          createdAt: appointment.createdAt!,
          status: appointment.status as AppointmentStatuses,
          costInCents: appointment.costInCents,
        },
        new UniqueEntityID(appointment.id),
      )
    },
  )

  const p = Psychologist.create(
    {
      name: Name.create(model.name).value as Name,
      email: Email.create(model.email).value as Email,
      crp: CRP.create(model.crp).value as CRP,
      phone: Phone.create(model.phone).value as Phone,
      createdAt: model.createdAt,
      availableTimes: new AvailableTimesList(availableTimes),
      consultationPriceInCents: model.consultationPriceInCents ?? 0,
      specialties: new SpecialtyList(specialties),
      scheduledAppointments,
    },
    new UniqueEntityID(model.id),
  )
  return p
}
