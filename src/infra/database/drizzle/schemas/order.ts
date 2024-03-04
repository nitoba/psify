import { relations } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'approved',
  'canceled',
  'paid',
])

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  costumerId: uuid('costumer_id').notNull(),
  sellerId: uuid('seller_id').notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  paymentMethod: varchar('payment_method', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const orderItems = pgTable('orders_items', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  itemId: uuid('item_id').notNull(),
  orderId: uuid('order_id')
    .references(() => orders.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  priceInCents: real('price_in_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orderRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems, { relationName: 'order_items' }),
}))

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    relationName: 'order_items',
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}))
