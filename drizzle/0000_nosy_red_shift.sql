CREATE TABLE "addresses" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"label" varchar(100) NOT NULL,
	"details" text NOT NULL,
	"wilaya" varchar(100) NOT NULL,
	"neighborhood" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "citizen_reports" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"status" varchar(30) DEFAULT 'PENDING' NOT NULL,
	"lat" numeric(10, 7) NOT NULL,
	"lng" numeric(10, 7) NOT NULL,
	"author" varchar(150) NOT NULL,
	"wilaya" varchar(100) NOT NULL,
	"neighborhood" varchar(100) NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_news" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"author" varchar(150) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(30) DEFAULT 'INFO' NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"comments" integer DEFAULT 0 NOT NULL,
	"wilaya" varchar(100) NOT NULL,
	"neighborhood" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_services" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"provider" varchar(150) NOT NULL,
	"category" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"price" varchar(100),
	"rating" numeric(3, 2) DEFAULT '4.50' NOT NULL,
	"phone" varchar(30) NOT NULL,
	"wilaya" varchar(100) NOT NULL,
	"neighborhood" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_transactions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"order_id" varchar(64),
	"points" integer NOT NULL,
	"description" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"order_id" varchar(64) NOT NULL,
	"product_id" varchar(64),
	"product_name" varchar(255) NOT NULL,
	"product_image" text,
	"unit_price" numeric(10, 2) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64),
	"store_id" varchar(64),
	"store_name" varchar(255) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" varchar(30) DEFAULT 'PENDING' NOT NULL,
	"points_gained" integer DEFAULT 0 NOT NULL,
	"delivery_label" varchar(100),
	"delivery_details" text,
	"delivery_wilaya" varchar(100),
	"delivery_neighborhood" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"store_id" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"category" varchar(50) NOT NULL,
	"origin" varchar(20) DEFAULT 'LOCAL' NOT NULL,
	"image" text NOT NULL,
	"stock" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"distance" varchar(50) DEFAULT '500m' NOT NULL,
	"rating" numeric(3, 2) DEFAULT '4.50' NOT NULL,
	"hours" varchar(100) DEFAULT '08:00 - 20:00' NOT NULL,
	"image" text NOT NULL,
	"wilaya" varchar(100) NOT NULL,
	"neighborhood" varchar(100) NOT NULL,
	"description" text,
	"phone" varchar(30),
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"pseudonym" varchar(100) NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(30),
	"role" varchar(20) DEFAULT 'CLIENT' NOT NULL,
	"points" integer DEFAULT 250 NOT NULL,
	"wilaya" varchar(100) DEFAULT '16 - Alger' NOT NULL,
	"neighborhood" varchar(100) DEFAULT 'El Biar' NOT NULL,
	"lang" varchar(5) DEFAULT 'fr' NOT NULL,
	"theme" varchar(10) DEFAULT 'light' NOT NULL,
	"business_type" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_pseudonym_unique" UNIQUE("pseudonym"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "addresses_user_id_idx" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "citizen_reports_category_idx" ON "citizen_reports" USING btree ("category");--> statement-breakpoint
CREATE INDEX "citizen_reports_status_idx" ON "citizen_reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "citizen_reports_wilaya_idx" ON "citizen_reports" USING btree ("wilaya");--> statement-breakpoint
CREATE INDEX "community_news_wilaya_idx" ON "community_news" USING btree ("wilaya");--> statement-breakpoint
CREATE INDEX "community_news_neighborhood_idx" ON "community_news" USING btree ("neighborhood");--> statement-breakpoint
CREATE INDEX "community_news_created_at_idx" ON "community_news" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "community_services_category_idx" ON "community_services" USING btree ("category");--> statement-breakpoint
CREATE INDEX "community_services_wilaya_idx" ON "community_services" USING btree ("wilaya");--> statement-breakpoint
CREATE INDEX "community_services_neighborhood_idx" ON "community_services" USING btree ("neighborhood");--> statement-breakpoint
CREATE INDEX "loyalty_transactions_user_id_idx" ON "loyalty_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "loyalty_transactions_created_at_idx" ON "loyalty_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_store_id_idx" ON "orders" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "products_store_id_idx" ON "products" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "products_origin_idx" ON "products" USING btree ("origin");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "stores_category_idx" ON "stores" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stores_wilaya_idx" ON "stores" USING btree ("wilaya");--> statement-breakpoint
CREATE INDEX "stores_neighborhood_idx" ON "stores" USING btree ("neighborhood");--> statement-breakpoint
CREATE INDEX "stores_name_idx" ON "stores" USING btree ("name");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_pseudonym_idx" ON "users" USING btree ("pseudonym");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");