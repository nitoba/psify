import { relations } from 'drizzle-orm'
import { decimal, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { patient } from './patient'
import { psychologist } from './psychologist'

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'pending',
  'scheduled',
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
  costInCents: decimal('cost_in_cents').notNull(),
  status: appointmentStatusEnum('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const appointmentRelations = relations(appointments, ({ one }) => ({
  psychologists: one(psychologist, {
    relationName: 'psychologist_scheduled_appointments',
    fields: [appointments.psychologistId],
    references: [psychologist.id],
  }),
  patients: one(patient, {
    relationName: 'patient_scheduled_appointments',
    fields: [appointments.patientId],
    references: [patient.id],
  }),
}))
