import { relations } from 'drizzle-orm'
import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { appointments } from './appointment'

export const psychologist = pgTable('psychologists', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  phone: varchar('phone', { length: 256 }).notNull(),
  password: text('password').notNull(),
  crm: text('crm').notNull().unique(),
  consultationPriceInCents: decimal('consultation_price_in_cents'),
  specialties: text('specialties').array().notNull(),
  authUserId: uuid('auth_user_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const availableTimes = pgTable('available_times', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  time: varchar('time', { length: 256 }).notNull(),
  weekday: integer('weekday').notNull(),
  psychologistId: uuid('psychologist_id')
    .references(() => psychologist.id)
    .notNull(),
})

export const psychologistRelations = relations(psychologist, ({ many }) => ({
  availableTimes: many(availableTimes, { relationName: 'available_times' }),
  scheduledAppointments: many(appointments, {
    relationName: 'psychologist_scheduled_appointments',
  }),
}))

export const availableTimesRelations = relations(availableTimes, ({ one }) => ({
  psychologist: one(psychologist, {
    relationName: 'available_times',
    fields: [availableTimes.psychologistId],
    references: [psychologist.id],
  }),
}))
