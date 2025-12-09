import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userEnum = pgEnum('user_role', ['user', 'admin']);

export const users = pgTable('users', {
  id: serial().primaryKey(),
  age: integer().default(0),
  email: varchar({ length: 40 }).unique().notNull(),
  bio: text().notNull(),
  isActive: boolean().default(false).notNull(),
  balance: real().default(0),
  uuid: uuid().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  role: userEnum().default('user'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const usersRealtions = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  posts: many(posts),
  chats: many(chats),
}));

export const profiles = pgTable('profiles', {
  id: serial().primaryKey(),
  userId: integer().references(() => users.id),
  name: varchar(),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const posts = pgTable('posts', {
  id: serial().primaryKey(),
  userId: integer().references(() => users.id),
  title: varchar(),
  text: text(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
}));

export const chats = pgTable('chats', {
  id: serial().primaryKey(),
  title: varchar(),
  messages: json(),
});

export const chatsRelations = relations(chats, ({ many }) => ({
  users: many(users),
}));

export const usersToChats = pgTable(
  'users_to_chats',
  {
    id: serial(),
    userId: integer().references(() => users.id),
    chatId: integer().references(() => chats.id),
  },
  (t) => [primaryKey({ columns: [t.id, t.userId, t.chatId] })],
);

export const usersToChatsRelations = relations(usersToChats, ({ one }) => ({
  user: one(users, {
    fields: [usersToChats.userId],
    references: [users.id],
  }),
  chats: one(chats, {
    fields: [usersToChats.chatId],
    references: [chats.id],
  }),
}));
