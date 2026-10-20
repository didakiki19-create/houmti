import { 
  pgTable, 
  varchar, 
  text, 
  integer, 
  decimal, 
  timestamp, 
  index, 
  jsonb 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. USERS
// ==========================================
export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  pseudonym: varchar("pseudonym", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 30 }),
  role: varchar("role", { length: 20 }).notNull().default("CLIENT"), // CLIENT, STORE, ADMIN
  points: integer("points").notNull().default(250),
  wilaya: varchar("wilaya", { length: 100 }).notNull().default("16 - Alger"),
  neighborhood: varchar("neighborhood", { length: 100 }).notNull().default("El Biar"),
  lang: varchar("lang", { length: 5 }).notNull().default("fr"),
  theme: varchar("theme", { length: 10 }).notNull().default("light"),
  businessType: varchar("business_type", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  pseudonymIdx: index("users_pseudonym_idx").on(table.pseudonym),
  roleIdx: index("users_role_idx").on(table.role)
}));

// ==========================================
// 2. ADDRESSES
// ==========================================
export const addresses = pgTable("addresses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).notNull(), // Maison, Bureau, etc.
  details: text("details").notNull(),
  wilaya: varchar("wilaya", { length: 100 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  userIdIdx: index("addresses_user_id_idx").on(table.userId)
}));

// ==========================================
// 3. STORES
// ==========================================
export const stores = pgTable("stores", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // grocery, bread, cosmetics, hardware, pizzeria, dairy, fruit, drinks
  distance: varchar("distance", { length: 50 }).notNull().default("500m"),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("4.50"),
  hours: varchar("hours", { length: 100 }).notNull().default("08:00 - 20:00"),
  image: text("image").notNull(),
  wilaya: varchar("wilaya", { length: 100 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 100 }).notNull(),
  description: text("description"),
  phone: varchar("phone", { length: 30 }),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  categoryIdx: index("stores_category_idx").on(table.category),
  wilayaIdx: index("stores_wilaya_idx").on(table.wilaya),
  neighborhoodIdx: index("stores_neighborhood_idx").on(table.neighborhood),
  nameIdx: index("stores_name_idx").on(table.name)
}));

// ==========================================
// 4. PRODUCTS
// ==========================================
export const products = pgTable("products", {
  id: varchar("id", { length: 64 }).primaryKey(),
  storeId: varchar("store_id", { length: 64 }).notNull().references(() => stores.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Précision financière exacte en DZD
  category: varchar("category", { length: 50 }).notNull(),
  origin: varchar("origin", { length: 20 }).notNull().default("LOCAL"), // LOCAL, IMPORTED
  image: text("image").notNull(),
  stock: integer("stock").notNull().default(10),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  storeIdIdx: index("products_store_id_idx").on(table.storeId),
  categoryIdx: index("products_category_idx").on(table.category),
  originIdx: index("products_origin_idx").on(table.origin),
  nameIdx: index("products_name_idx").on(table.name)
}));

// ==========================================
// 5. ORDERS
// ==========================================
export const orders = pgTable("orders", {
  id: varchar("id", { length: 64 }).primaryKey(), // CMD-XXXXXX
  userId: varchar("user_id", { length: 64 }).references(() => users.id, { onDelete: "set null" }),
  storeId: varchar("store_id", { length: 64 }).references(() => stores.id, { onDelete: "set null" }),
  storeName: varchar("store_name", { length: 255 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("PENDING"), // PENDING, PREPARING, PICKUP, DELIVERING, COMPLETED, CANCELLED
  pointsGained: integer("points_gained").notNull().default(0),
  // Détails d'adresse de livraison snapshotée
  deliveryLabel: varchar("delivery_label", { length: 100 }),
  deliveryDetails: text("delivery_details"),
  deliveryWilaya: varchar("delivery_wilaya", { length: 100 }),
  deliveryNeighborhood: varchar("delivery_neighborhood", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  userIdIdx: index("orders_user_id_idx").on(table.userId),
  storeIdIdx: index("orders_store_id_idx").on(table.storeId),
  statusIdx: index("orders_status_idx").on(table.status),
  createdAtIdx: index("orders_created_at_idx").on(table.createdAt)
}));

// ==========================================
// 6. ORDER ITEMS
// ==========================================
export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orderId: varchar("order_id", { length: 64 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id", { length: 64 }).references(() => products.id, { onDelete: "set null" }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productImage: text("product_image"),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(), // Prix figé au moment de la commande
  quantity: integer("quantity").notNull().default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  orderIdIdx: index("order_items_order_id_idx").on(table.orderId),
  productIdIdx: index("order_items_product_id_idx").on(table.productId)
}));

// ==========================================
// 7. COMMUNITY NEWS
// ==========================================
export const communityNews = pgTable("community_news", {
  id: varchar("id", { length: 64 }).primaryKey(),
  author: varchar("author", { length: 150 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 30 }).notNull().default("INFO"), // ALERT, INFO, PROMO, EVENT
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  wilaya: varchar("wilaya", { length: 100 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  wilayaIdx: index("community_news_wilaya_idx").on(table.wilaya),
  neighborhoodIdx: index("community_news_neighborhood_idx").on(table.neighborhood),
  createdAtIdx: index("community_news_created_at_idx").on(table.createdAt)
}));

// ==========================================
// 8. COMMUNITY SERVICES
// ==========================================
export const communityServices = pgTable("community_services", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 150 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // PLUMBING, ELECTRICITY, CLEANING, TUTORING, OTHER
  description: text("description").notNull(),
  price: varchar("price", { length: 100 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("4.50"),
  phone: varchar("phone", { length: 30 }).notNull(),
  wilaya: varchar("wilaya", { length: 100 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  categoryIdx: index("community_services_category_idx").on(table.category),
  wilayaIdx: index("community_services_wilaya_idx").on(table.wilaya),
  neighborhoodIdx: index("community_services_neighborhood_idx").on(table.neighborhood)
}));

// ==========================================
// 9. CITIZEN REPORTS
// ==========================================
export const citizenReports = pgTable("citizen_reports", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // INFRASTRUCTURE, CLEANLINESS, SECURITY, OTHER
  status: varchar("status", { length: 30 }).notNull().default("PENDING"), // PENDING, IN_PROGRESS, RESOLVED
  lat: decimal("lat", { precision: 10, scale: 7 }).notNull(),
  lng: decimal("lng", { precision: 10, scale: 7 }).notNull(),
  author: varchar("author", { length: 150 }).notNull(),
  wilaya: varchar("wilaya", { length: 100 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 100 }).notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  categoryIdx: index("citizen_reports_category_idx").on(table.category),
  statusIdx: index("citizen_reports_status_idx").on(table.status),
  wilayaIdx: index("citizen_reports_wilaya_idx").on(table.wilaya)
}));

// ==========================================
// 10. LOYALTY TRANSACTIONS
// ==========================================
export const loyaltyTransactions = pgTable("loyalty_transactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: varchar("order_id", { length: 64 }).references(() => orders.id, { onDelete: "set null" }),
  points: integer("points").notNull(), // Positif pour gain, négatif pour utilisation
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  userIdIdx: index("loyalty_transactions_user_id_idx").on(table.userId),
  createdAtIdx: index("loyalty_transactions_created_at_idx").on(table.createdAt)
}));

// ==========================================
// DRIZZLE RELATIONS
// ==========================================
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  loyaltyTransactions: many(loyaltyTransactions)
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id]
  })
}));

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  orders: many(orders)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id]
  }),
  orderItems: many(orderItems)
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id]
  }),
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

export const loyaltyTransactionsRelations = relations(loyaltyTransactions, ({ one }) => ({
  user: one(users, {
    fields: [loyaltyTransactions.userId],
    references: [users.id]
  }),
  order: one(orders, {
    fields: [loyaltyTransactions.orderId],
    references: [orders.id]
  })
}));
