import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const psychologist = pgTable('psychologists', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: text('password').notNull(),
  crm: text('crm').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
