import {
  pgTable,
  text,
  numeric,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  serviceId: text("service_id"),
  domain: text("domain"),
  category: text("category").notNull().default("Diğer"),
  color: text("color").notNull().default("#6366f1"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("TRY"),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  nextBillingDate: timestamp("next_billing_date").notNull(),
  startDate: timestamp("start_date").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  gmailMessageId: text("gmail_message_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gmailTokens = pgTable("gmail_tokens", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pushTokens = pgTable("push_tokens", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  token: text("token").notNull().unique(),
  platform: text("platform").notNull().default("expo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentLogs = pgTable("payment_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  subscriptionId: text("subscription_id").notNull(),
  userId: text("user_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  paidAt: timestamp("paid_at").notNull().defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
