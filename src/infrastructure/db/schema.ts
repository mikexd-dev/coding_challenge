import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const candidates = pgTable('candidates', {
  id: varchar('id', { length: 20 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('NEW'),
  reason: text('reason'),
  decisionDate: timestamp('decision_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
