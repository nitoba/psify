import { InferSelectModel } from 'drizzle-orm'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Patient as AuthPatient } from '@/domain/auth/enterprise/entities/patient'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { Patient } from '@/domain/patient/enterprise/entities/patient'
import {
  Appointment,
  AppointmentStatuses,
} from '@/domain/schedules/enterprise/entities/appointment'

import { appointments } from '../schemas/appointment'
import { patient } from '../schemas/patient'

export function toAuthDomain(
  model: InferSelectModel<typeof patient>,
): AuthPatient {
  const p = AuthPatient.create(
    {
      name: Name.create(model.name).value as Name,
      email: Email.create(model.email).value as Email,
      password: model.password,
      phone: Phone.create(model.phone).value as Phone,
      createdAt: model.createdAt,
    },
    new UniqueEntityID(model.id),
  )
  return p
}
type PatientModel = InferSelectModel<typeof patient> & {
  scheduledAppointments: InferSelectModel<typeof appointments>[]
}

export function toDomain(model: PatientModel): Patient {
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
  const p = Patient.create(
    {
      email: Email.create(model.email).value as Email,
      name: Name.create(model.name).value as Name,
      phone: Phone.create(model.phone).value as Phone,
      createdAt: model.createdAt,
      scheduledAppointments,
    },
    new UniqueEntityID(model.id),
  )

  return p
}
