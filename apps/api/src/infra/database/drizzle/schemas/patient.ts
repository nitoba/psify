import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { appointments } from './appointment'

export const patient = pgTable('patients', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  phone: varchar('phone', { length: 256 }).notNull(),
  password: text('password').notNull(),
  avatarUrl: varchar('avatar_url', { length: 256 }),
  authUserId: uuid('auth_user_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const patientRelations = relations(patient, ({ many }) => ({
  scheduledAppointments: many(appointments, {
    relationName: 'patient_scheduled_appointments',
  }),
}))
