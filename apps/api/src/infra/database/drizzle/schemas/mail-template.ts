import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

export const mailTemplates = pgTable('mail_templates', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  title: varchar('name', { length: 256 }).notNull(),
  content: text('content').notNull(),
})
