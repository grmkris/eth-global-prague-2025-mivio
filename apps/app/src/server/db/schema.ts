// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { 
  pgTableCreator, 
  varchar, 
  text, 
  integer, 
  timestamp, 
  boolean, 
  decimal, 
  pgEnum,
  index,
  uniqueIndex,
  primaryKey
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `app_${name}`);

// Enums
export const userRoleEnum = pgEnum("user_role", ["attendee", "organizer", "vendor", "admin"]);
export const taskStatusEnum = pgEnum("task_status", ["pending", "in_progress", "completed", "verified"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["payment", "reward", "topup", "purchase", "refund"]);
export const rewardTypeEnum = pgEnum("reward_type", ["token", "badge", "perk"]);
export const productCategoryEnum = pgEnum("product_category", ["merch", "food", "experience", "ticket"]);
export const eventStatusEnum = pgEnum("event_status", ["draft", "upcoming", "active", "completed", "cancelled"]);

// Users table (wallet-based authentication)
export const users = createTable(
  "user",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    walletAddress: t.varchar({ length: 42 }).unique().notNull(),
    username: t.varchar({ length: 50 }).unique(),
    email: t.varchar({ length: 255 }),
    displayName: t.varchar({ length: 100 }),
    bio: t.text(),
    avatarUrl: t.text(),
    role: userRoleEnum().default("attendee").notNull(),
    totalPoints: t.integer().default(0).notNull(),
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (table) => [
    uniqueIndex("wallet_address_idx").on(table.walletAddress),
    index("username_idx").on(table.username),
  ]
);

// Events table
export const events = createTable(
  "event",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    slug: t.varchar({ length: 255 }).unique().notNull(),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    location: t.varchar({ length: 500 }),
    bannerImage: t.text(),
    startDate: t.timestamp({ withTimezone: true }).notNull(),
    endDate: t.timestamp({ withTimezone: true }).notNull(),
    organizerId: t.integer().references(() => users.id).notNull(),
    status: eventStatusEnum().default("draft").notNull(),
    maxAttendees: t.integer(),
    virtualUrl: t.text(),
    metadata: t.text(), // JSON string for additional event data
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (table) => [
    uniqueIndex("event_slug_idx").on(table.slug),
    index("event_status_idx").on(table.status),
    index("event_dates_idx").on(table.startDate, table.endDate),
  ]
);

// Event participants (many-to-many relationship)
export const eventParticipants = createTable(
  "event_participant",
  (t) => ({
    eventId: t.integer().references(() => events.id).notNull(),
    userId: t.integer().references(() => users.id).notNull(),
    joinedAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    role: userRoleEnum().default("attendee").notNull(),
    checkedIn: t.boolean().default(false).notNull(),
    checkedInAt: t.timestamp({ withTimezone: true }),
  }),
  (table) => [
    primaryKey({ columns: [table.eventId, table.userId] }),
    index("participant_event_idx").on(table.eventId),
    index("participant_user_idx").on(table.userId),
  ]
);

// Event wallets (each event participant has a wallet for that event)
export const eventWallets = createTable(
  "event_wallet",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: t.integer().references(() => events.id).notNull(),
    userId: t.integer().references(() => users.id).notNull(),
    balance: t.numeric({ precision: 10, scale: 2 }).default("0.00").notNull(),
    totalEarned: t.numeric({ precision: 10, scale: 2 }).default("0.00").notNull(),
    totalSpent: t.numeric({ precision: 10, scale: 2 }).default("0.00").notNull(),
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (table) => [
    uniqueIndex("event_wallet_idx").on(table.eventId, table.userId),
  ]
);

// Tasks/Microtasks
export const tasks = createTable(
  "task",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: t.integer().references(() => events.id).notNull(),
    title: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    reward: t.numeric({ precision: 10, scale: 2 }).notNull(),
    rewardType: rewardTypeEnum().default("token").notNull(),
    maxCompletions: t.integer(), // null means unlimited
    requiresVerification: t.boolean().default(false).notNull(),
    metadata: t.text(), // JSON for task-specific data (e.g., QR codes, locations)
    isActive: t.boolean().default(true).notNull(),
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (table) => [
    index("task_event_idx").on(table.eventId),
    index("task_active_idx").on(table.isActive),
  ]
);

// Task completions
export const taskCompletions = createTable(
  "task_completion",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    taskId: t.integer().references(() => tasks.id).notNull(),
    userId: t.integer().references(() => users.id).notNull(),
    status: taskStatusEnum().default("pending").notNull(),
    proofUrl: t.text(), // For tasks requiring photo/verification
    verifiedBy: t.integer().references(() => users.id),
    completedAt: t.timestamp({ withTimezone: true }),
    verifiedAt: t.timestamp({ withTimezone: true }),
    metadata: t.text(), // JSON for additional completion data
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }),
  (table) => [
    index("completion_task_idx").on(table.taskId),
    index("completion_user_idx").on(table.userId),
    index("completion_status_idx").on(table.status),
  ]
);

// Shop products
export const products = createTable(
  "product",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: t.integer().references(() => events.id).notNull(),
    vendorId: t.integer().references(() => users.id),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    price: t.numeric({ precision: 10, scale: 2 }).notNull(),
    category: productCategoryEnum().notNull(),
    imageUrl: t.text(),
    stock: t.integer(), // null means unlimited
    maxPerUser: t.integer(), // purchase limit per user
    isAvailable: t.boolean().default(true).notNull(),
    metadata: t.text(), // JSON for product variants, sizes, etc.
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: t.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (table) => [
    index("product_event_idx").on(table.eventId),
    index("product_category_idx").on(table.category),
    index("product_available_idx").on(table.isAvailable),
  ]
);

// Transactions
export const transactions = createTable(
  "transaction",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventWalletId: t.integer().references(() => eventWallets.id).notNull(),
    type: transactionTypeEnum().notNull(),
    amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    description: t.varchar({ length: 500 }),
    referenceId: t.integer(), // References task completion, purchase, etc.
    referenceType: t.varchar({ length: 50 }), // "task", "purchase", "reward", etc.
    metadata: t.text(), // JSON for additional transaction data
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }),
  (table) => [
    index("transaction_wallet_idx").on(table.eventWalletId),
    index("transaction_type_idx").on(table.type),
    index("transaction_created_idx").on(table.createdAt),
  ]
);

// Purchases
export const purchases = createTable(
  "purchase",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    productId: t.integer().references(() => products.id).notNull(),
    userId: t.integer().references(() => users.id).notNull(),
    eventWalletId: t.integer().references(() => eventWallets.id).notNull(),
    quantity: t.integer().default(1).notNull(),
    totalPrice: t.numeric({ precision: 10, scale: 2 }).notNull(),
    status: t.varchar({ length: 50 }).default("pending").notNull(), // pending, completed, cancelled, refunded
    qrCode: t.text(), // For pickup verification
    redeemedAt: t.timestamp({ withTimezone: true }),
    metadata: t.text(), // JSON for size, variant, special instructions
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }),
  (table) => [
    index("purchase_product_idx").on(table.productId),
    index("purchase_user_idx").on(table.userId),
    index("purchase_status_idx").on(table.status),
  ]
);

// Rewards and badges
export const rewards = createTable(
  "reward",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: t.integer().references(() => events.id),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    type: rewardTypeEnum().notNull(),
    imageUrl: t.text(),
    criteria: t.text(), // JSON for reward criteria
    value: t.numeric({ precision: 10, scale: 2 }), // For token rewards
    metadata: t.text(), // JSON for additional reward data
    isActive: t.boolean().default(true).notNull(),
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }),
  (table) => [
    index("reward_event_idx").on(table.eventId),
    index("reward_type_idx").on(table.type),
  ]
);

// User rewards (earned badges, perks, etc.)
export const userRewards = createTable(
  "user_reward",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: t.integer().references(() => users.id).notNull(),
    rewardId: t.integer().references(() => rewards.id).notNull(),
    eventId: t.integer().references(() => events.id),
    earnedAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    expiresAt: t.timestamp({ withTimezone: true }),
    metadata: t.text(), // JSON for additional data
  }),
  (table) => [
    index("user_reward_user_idx").on(table.userId),
    index("user_reward_event_idx").on(table.eventId),
  ]
);

// Announcements/Notifications
export const announcements = createTable(
  "announcement",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: t.integer().references(() => events.id).notNull(),
    title: t.varchar({ length: 255 }).notNull(),
    content: t.text(),
    priority: t.varchar({ length: 20 }).default("normal").notNull(), // low, normal, high, urgent
    publishedAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    expiresAt: t.timestamp({ withTimezone: true }),
    createdBy: t.integer().references(() => users.id).notNull(),
  }),
  (table) => [
    index("announcement_event_idx").on(table.eventId),
    index("announcement_published_idx").on(table.publishedAt),
  ]
);
