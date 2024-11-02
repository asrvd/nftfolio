import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";

// Asset table
export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  assetUrl: text("asset_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  ownerEmail: text("owner_email").notNull().references(() => profiles.email),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => profiles.id),
});

// Transactions table for storing the history of asset transfers
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromUserId: uuid("from_user_id").notNull(),
  fromUserEmail: text("from_user_email").notNull(),
  toUserEmail: text("to_user_email").notNull(),
  toUserId: uuid("to_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
});

/**
 * Profiles table.
 * This is a copy of table "auth.users" from supabase.
 * Since supabase doesn't expose the table directly, we create a copy
 * to use in our application which is updated every time a new user is created
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
});

/**
 * Relations
 * Many-to-one between assets and profiles
 * One-to-many between assets and transactions
 */
export const assetsRelations = relations(assets, ({ many, one }) => ({
  transactions: many(transactions),
  owner: one(profiles, {
    fields: [assets.ownerId],
    references: [profiles.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  assets: many(assets),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  asset: one(assets, {
    fields: [transactions.assetId],
    references: [assets.id],
  }),
}));

export type Profile = InferSelectModel<typeof profiles>;
export type Transaction = InferSelectModel<typeof transactions>;
export type Asset = InferSelectModel<typeof assets> & {
  owner: Profile;
  transactions: Transaction[];
};
export type RawAsset = InferSelectModel<typeof assets>;
