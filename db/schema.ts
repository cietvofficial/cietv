import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabel Users (Admin)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabel Categories 
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), 
  slug: text('slug').unique().notNull(), 
  description: text('description'), 
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabel Posts
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  
  categoryId: integer('category_id').references(() => categories.id), 
  
  author: text('author'),
  
  readTime: integer('read_time'), 
  
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// Relasi: Satu Post punya Satu Category & Satu Author
export const postsRelations = relations(posts, ({ one }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
}));

// Relasi: Satu Category punya Banyak Post
export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));
