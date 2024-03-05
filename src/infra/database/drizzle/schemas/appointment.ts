import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, real, timestamp, uuid } from 'drizzle-orm/pg-core'

import { patient } from './patient'
import { psychologist } from './psychologist'

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'pending',
  'scheduled',
  'approved',
  'finished',
  'inactive',
  'canceled',
])

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  psychologistId: uuid('psychologist_id')
    .notNull()
    .references(() => psychologist.id),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patient.id),
  scheduledTo: timestamp('scheduled_to').notNull(),
  costInCents: real('cost_in_cents').notNull(),
  status: appointmentStatusEnum('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const appointmentRelations = relations(appointments, ({ one }) => ({
  psychologist: one(psychologist, {
    relationName: 'psychologist_scheduled_appointments',
    fields: [appointments.psychologistId],
    references: [psychologist.id],
  }),
  patient: one(patient, {
    relationName: 'patient_scheduled_appointments',
    fields: [appointments.patientId],
    references: [patient.id],
  }),
}))
