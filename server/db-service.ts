import { eq, and, ilike, desc, sql } from "drizzle-orm";
import { getDb, schema, checkDatabaseConnection } from "../db";
import { Store, Product, Order, HoumaNews, HoumaService, CitizenReport, UserProfile } from "../types";
import { 
  MOCK_STORES, 
  MOCK_PRODUCTS, 
  MOCK_NEWS, 
  MOCK_SERVICES, 
  MOCK_REPORTS 
} from "../constants";

// Fallback in-memory stores used ONLY when DATABASE_URL is not provided
let fallbackStores: Store[] = [...MOCK_STORES];
let fallbackProducts: Product[] = [...MOCK_PRODUCTS];
let fallbackOrders: Order[] = [];
let fallbackNews: HoumaNews[] = [...MOCK_NEWS];
let fallbackServices: HoumaService[] = [...MOCK_SERVICES];
let fallbackReports: CitizenReport[] = [...MOCK_REPORTS];

export const dbService = {
  // ==========================================
  // HEALTH CHECK
  // ==========================================
  async getHealth() {
    const dbCheck = await checkDatabaseConnection();
    return {
      status: "ok",
      app: "Hoomty API",
      database: dbCheck.connected ? "connected" : "disconnected",
      latencyMs: dbCheck.latencyMs,
      timestamp: new Date().toISOString()
    };
  },

  // ==========================================
  // AUTH / USER
  // ==========================================
  async loginOrRegister(pseudonym: string, role?: string): Promise<UserProfile> {
    const db = getDb();
    if (db) {
      try {
        // Find existing user or create
        const existingUsers = await db.select().from(schema.users).where(eq(schema.users.pseudonym, pseudonym));
        let userRecord = existingUsers[0];

        if (!userRecord) {
          const newId = `usr-${Date.now()}`;
          const cleanEmail = `${pseudonym.toLowerCase().replace(/[^a-z0-9]/g, "")}@hoomty.dz`;
          await db.insert(schema.users).values({
            id: newId,
            pseudonym,
            name: pseudonym,
            email: cleanEmail,
            role: role || "CLIENT",
            points: 250,
            wilaya: "16 - Alger",
            neighborhood: "El Biar",
            lang: "fr",
            theme: "light",
          });
          const created = await db.select().from(schema.users).where(eq(schema.users.id, newId));
          userRecord = created[0];

          // Create default address
          await db.insert(schema.addresses).values({
            id: `addr-${Date.now()}`,
            userId: newId,
            label: "Maison",
            details: "Résidence Les Pins, Bât C",
            wilaya: "16 - Alger",
            neighborhood: "El Biar"
          });
        }

        // Fetch user's addresses
        const userAddresses = await db.select().from(schema.addresses).where(eq(schema.addresses.userId, userRecord.id));

        return {
          name: userRecord.name,
          pseudonym: userRecord.pseudonym,
          email: userRecord.email,
          points: userRecord.points,
          role: userRecord.role as any,
          wilaya: userRecord.wilaya,
          neighborhood: userRecord.neighborhood,
          lang: userRecord.lang as "fr" | "ar",
          theme: userRecord.theme as "light" | "dark",
          businessType: userRecord.businessType || undefined,
          addresses: userAddresses.map(a => ({
            id: a.id,
            label: a.label,
            details: a.details,
            wilaya: a.wilaya,
            neighborhood: a.neighborhood
          }))
        };
      } catch (err) {
        console.error("PostgreSQL user login error, using memory fallback:", err);
      }
    }

    // Fallback if DB is unavailable
    return {
      name: pseudonym,
      pseudonym,
      email: `${pseudonym.toLowerCase().replace(/\s+/g, "")}@hoomty.dz`,
      points: 250,
      role: (role as any) || "CLIENT",
      wilaya: "16 - Alger",
      neighborhood: "El Biar",
      lang: "fr",
      theme: "light",
      addresses: [
        {
          id: "addr-1",
          label: "Maison",
          details: "Résidence Les Pins, Bât C",
          wilaya: "16 - Alger",
          neighborhood: "El Biar"
        }
      ]
    };
  },

  // ==========================================
  // STORES
  // ==========================================
  async getStores(filters: { category?: string; wilaya?: string; neighborhood?: string; search?: string }): Promise<Store[]> {
    const db = getDb();
    if (db) {
      try {
        const conditions: any[] = [];

        if (filters.category && filters.category !== "all" && filters.category !== "Tout") {
          conditions.push(ilike(schema.stores.category, filters.category));
        }
        if (filters.wilaya) {
          conditions.push(eq(schema.stores.wilaya, filters.wilaya));
        }
        if (filters.neighborhood) {
          conditions.push(eq(schema.stores.neighborhood, filters.neighborhood));
        }
        if (filters.search) {
          const q = `%${filters.search}%`;
          conditions.push(
            sql`(${schema.stores.name} ILIKE ${q} OR ${schema.stores.category} ILIKE ${q} OR ${schema.stores.neighborhood} ILIKE ${q})`
          );
        }

        const records = conditions.length > 0
          ? await db.select().from(schema.stores).where(and(...conditions))
          : await db.select().from(schema.stores);

        return records.map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          distance: r.distance,
          rating: Number(r.rating),
          hours: r.hours,
          image: r.image,
          wilaya: r.wilaya,
          neighborhood: r.neighborhood,
          description: r.description || undefined,
          phone: r.phone || undefined,
          lat: r.lat ? Number(r.lat) : undefined,
          lng: r.lng ? Number(r.lng) : undefined,
        }));
      } catch (err) {
        console.error("PostgreSQL getStores error, using fallback:", err);
      }
    }

    // In-memory fallback
    let filtered = [...fallbackStores];
    if (filters.category && filters.category !== "all" && filters.category !== "Tout") {
      filtered = filtered.filter(s => s.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.wilaya) filtered = filtered.filter(s => s.wilaya === filters.wilaya);
    if (filters.neighborhood) filtered = filtered.filter(s => s.neighborhood === filters.neighborhood);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    return filtered;
  },

  async getStoreById(id: string): Promise<Store | null> {
    const db = getDb();
    if (db) {
      try {
        const records = await db.select().from(schema.stores).where(eq(schema.stores.id, id));
        if (records[0]) {
          const r = records[0];
          return {
            id: r.id,
            name: r.name,
            category: r.category,
            distance: r.distance,
            rating: Number(r.rating),
            hours: r.hours,
            image: r.image,
            wilaya: r.wilaya,
            neighborhood: r.neighborhood,
            description: r.description || undefined,
            phone: r.phone || undefined,
            lat: r.lat ? Number(r.lat) : undefined,
            lng: r.lng ? Number(r.lng) : undefined,
          };
        }
      } catch (err) {
        console.error("PostgreSQL getStoreById error:", err);
      }
    }

    return fallbackStores.find(s => s.id === id) || null;
  },

  // ==========================================
  // PRODUCTS
  // ==========================================
  async getProducts(filters: { storeId?: string; category?: string; origin?: string; search?: string }): Promise<Product[]> {
    const db = getDb();
    if (db) {
      try {
        const conditions: any[] = [];
        if (filters.storeId) conditions.push(eq(schema.products.storeId, filters.storeId));
        if (filters.category) conditions.push(ilike(schema.products.category, filters.category));
        if (filters.origin) conditions.push(eq(schema.products.origin, filters.origin));
        if (filters.search) conditions.push(ilike(schema.products.name, `%${filters.search}%`));

        const records = conditions.length > 0
          ? await db.select().from(schema.products).where(and(...conditions))
          : await db.select().from(schema.products);

        return records.map(p => ({
          id: p.id,
          storeId: p.storeId,
          name: p.name,
          price: Number(p.price),
          category: p.category,
          origin: p.origin as any,
          image: p.image,
          stock: p.stock
        }));
      } catch (err) {
        console.error("PostgreSQL getProducts error:", err);
      }
    }

    let filtered = [...fallbackProducts];
    if (filters.storeId) filtered = filtered.filter(p => p.storeId === filters.storeId);
    if (filters.category) filtered = filtered.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    if (filters.origin) filtered = filtered.filter(p => p.origin === filters.origin);
    if (filters.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
    return filtered;
  },

  async createProduct(data: { name: string; price: number; storeId: string; category?: string; origin?: string; image?: string; stock?: number }): Promise<Product> {
    const newId = `p-${Date.now()}`;
    const formattedPrice = Number(data.price).toFixed(2);
    const originVal = data.origin || "LOCAL";
    const categoryVal = data.category || "general";
    const imageVal = data.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
    const stockVal = Number(data.stock) || 10;

    const db = getDb();
    if (db) {
      try {
        await db.insert(schema.products).values({
          id: newId,
          storeId: data.storeId,
          name: data.name,
          price: formattedPrice,
          category: categoryVal,
          origin: originVal,
          image: imageVal,
          stock: stockVal
        });

        return {
          id: newId,
          storeId: data.storeId,
          name: data.name,
          price: Number(formattedPrice),
          category: categoryVal,
          origin: originVal as any,
          image: imageVal,
          stock: stockVal
        };
      } catch (err) {
        console.error("PostgreSQL createProduct error:", err);
      }
    }

    const item: Product = {
      id: newId,
      storeId: data.storeId,
      name: data.name,
      price: Number(data.price),
      category: categoryVal,
      origin: originVal as any,
      image: imageVal,
      stock: stockVal
    };
    fallbackProducts.push(item);
    return item;
  },

  // ==========================================
  // ORDERS (WITH ACID TRANSACTIONS)
  // ==========================================
  async getOrders(statusFilter?: string): Promise<Order[]> {
    const db = getDb();
    if (db) {
      try {
        const orderQuery = statusFilter
          ? db.select().from(schema.orders).where(eq(schema.orders.status, statusFilter)).orderBy(desc(schema.orders.createdAt))
          : db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));

        const orderRecords = await orderQuery;

        // Fetch order items for each order
        const results: Order[] = [];
        for (const ord of orderRecords) {
          const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, ord.id));
          results.push({
            id: ord.id,
            date: ord.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
            total: Number(ord.total),
            status: ord.status as any,
            pointsGained: ord.pointsGained,
            storeName: ord.storeName,
            address: ord.deliveryLabel ? {
              id: "addr-snapshot",
              label: ord.deliveryLabel,
              details: ord.deliveryDetails || "",
              wilaya: ord.deliveryWilaya || "",
              neighborhood: ord.deliveryNeighborhood || ""
            } : undefined,
            items: items.map(i => ({
              id: i.productId || i.id,
              name: i.productName,
              price: Number(i.unitPrice),
              quantity: i.quantity,
              category: "order-item",
              image: i.productImage || "",
              stock: 99,
              storeId: ord.storeId || "",
              origin: "LOCAL" as any
            }))
          });
        }
        return results;
      } catch (err) {
        console.error("PostgreSQL getOrders error:", err);
      }
    }

    if (statusFilter) {
      return fallbackOrders.filter(o => o.status === statusFilter);
    }
    return fallbackOrders;
  },

  async createOrder(data: { items: any[]; total: number; address?: any; storeName?: string; userId?: string }): Promise<Order> {
    const orderId = `CMD-${Date.now().toString().slice(-6)}`;
    const totalNum = Number(data.total);
    const pointsGained = Math.floor(totalNum / 100) * 10;
    const storeName = data.storeName || (data.items[0]?.name ? "Boutique Houma" : "Hoomty Store");
    const storeId = data.items[0]?.storeId || null;

    const db = getDb();
    if (db) {
      try {
        // EXÉCUTION DE TRANSACTION ATOMIQUE (ACID)
        await db.transaction(async (tx) => {
          // 1. Insertion de la commande principale
          await tx.insert(schema.orders).values({
            id: orderId,
            userId: data.userId || null,
            storeId: storeId,
            storeName: storeName,
            total: totalNum.toFixed(2),
            status: "PENDING",
            pointsGained: pointsGained,
            deliveryLabel: data.address?.label || null,
            deliveryDetails: data.address?.details || null,
            deliveryWilaya: data.address?.wilaya || null,
            deliveryNeighborhood: data.address?.neighborhood || null
          });

          // 2. Insertion des lignes de commandes avec SNAPSHOT DU PRIX UNITAIRE
          for (const item of data.items) {
            const unitPrice = Number(item.price);
            const qty = Number(item.quantity) || 1;
            const itemTotal = (unitPrice * qty).toFixed(2);

            await tx.insert(schema.orderItems).values({
              id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              orderId: orderId,
              productId: item.id || null,
              productName: item.name || "Produit Hoomty",
              productImage: item.image || null,
              unitPrice: unitPrice.toFixed(2),
              quantity: qty,
              totalPrice: itemTotal
            });

            // 3. Décrémentation du stock produit si le produit existe
            if (item.id) {
              await tx.update(schema.products)
                .set({
                  stock: sql`GREATEST(0, ${schema.products.stock} - ${qty})`,
                  updatedAt: new Date()
                })
                .where(eq(schema.products.id, item.id));
            }
          }

          // 4. Crédit des points de fidélité si l'utilisateur est renseigné
          if (data.userId && pointsGained > 0) {
            await tx.insert(schema.loyaltyTransactions).values({
              id: `pts-${Date.now()}`,
              userId: data.userId,
              orderId: orderId,
              points: pointsGained,
              description: `Gain points commande ${orderId}`
            });

            await tx.update(schema.users)
              .set({
                points: sql`${schema.users.points} + ${pointsGained}`,
                updatedAt: new Date()
              })
              .where(eq(schema.users.id, data.userId));
          }
        });

        return {
          id: orderId,
          date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
          total: totalNum,
          status: "PENDING",
          items: data.items,
          pointsGained,
          storeName,
          address: data.address
        };
      } catch (err) {
        console.error("PostgreSQL createOrder transaction failed, rollback occurred:", err);
      }
    }

    // In-memory fallback
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      total: totalNum,
      status: "PENDING",
      items: data.items,
      pointsGained,
      storeName,
      address: data.address
    };
    fallbackOrders.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    const db = getDb();
    if (db) {
      try {
        await db.update(schema.orders)
          .set({ status: status, updatedAt: new Date() })
          .where(eq(schema.orders.id, id));

        const updated = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
        if (updated[0]) {
          const ord = updated[0];
          return {
            id: ord.id,
            date: ord.createdAt.toLocaleDateString("fr-FR"),
            total: Number(ord.total),
            status: ord.status as any,
            items: [],
            pointsGained: ord.pointsGained,
            storeName: ord.storeName
          };
        }
      } catch (err) {
        console.error("PostgreSQL updateOrderStatus error:", err);
      }
    }

    const order = fallbackOrders.find(o => o.id === id);
    if (order) {
      order.status = status as any;
      return order;
    }
    return null;
  },

  // ==========================================
  // COMMUNITY NEWS
  // ==========================================
  async getNews(wilaya?: string, neighborhood?: string): Promise<HoumaNews[]> {
    const db = getDb();
    if (db) {
      try {
        const conditions: any[] = [];
        if (wilaya) conditions.push(eq(schema.communityNews.wilaya, wilaya));
        if (neighborhood) conditions.push(eq(schema.communityNews.neighborhood, neighborhood));

        const records = conditions.length > 0
          ? await db.select().from(schema.communityNews).where(and(...conditions)).orderBy(desc(schema.communityNews.createdAt))
          : await db.select().from(schema.communityNews).orderBy(desc(schema.communityNews.createdAt));

        return records.map(n => ({
          id: n.id,
          author: n.author,
          content: n.content,
          time: n.createdAt.toLocaleDateString("fr-FR"),
          type: n.type as any,
          likes: n.likes,
          comments: n.comments,
          wilaya: n.wilaya,
          neighborhood: n.neighborhood
        }));
      } catch (err) {
        console.error("PostgreSQL getNews error:", err);
      }
    }

    let filtered = [...fallbackNews];
    if (wilaya) filtered = filtered.filter(n => n.wilaya === wilaya);
    if (neighborhood) filtered = filtered.filter(n => n.neighborhood === neighborhood);
    return filtered;
  },

  async createNews(data: { author: string; content: string; type?: string; wilaya?: string; neighborhood?: string }): Promise<HoumaNews> {
    const newId = `news-${Date.now()}`;
    const typeVal = data.type || "INFO";
    const wilayaVal = data.wilaya || "16 - Alger";
    const neighborhoodVal = data.neighborhood || "Général";

    const db = getDb();
    if (db) {
      try {
        await db.insert(schema.communityNews).values({
          id: newId,
          author: data.author,
          content: data.content,
          type: typeVal,
          likes: 0,
          comments: 0,
          wilaya: wilayaVal,
          neighborhood: neighborhoodVal
        });

        return {
          id: newId,
          author: data.author,
          content: data.content,
          time: "À l'instant",
          type: typeVal as any,
          likes: 0,
          comments: 0,
          wilaya: wilayaVal,
          neighborhood: neighborhoodVal
        };
      } catch (err) {
        console.error("PostgreSQL createNews error:", err);
      }
    }

    const item: HoumaNews = {
      id: newId,
      author: data.author,
      content: data.content,
      time: "À l'instant",
      type: typeVal as any,
      likes: 0,
      comments: 0,
      wilaya: wilayaVal,
      neighborhood: neighborhoodVal
    };
    fallbackNews.unshift(item);
    return item;
  },

  async likeNews(id: string): Promise<HoumaNews | null> {
    const db = getDb();
    if (db) {
      try {
        await db.update(schema.communityNews)
          .set({
            likes: sql`${schema.communityNews.likes} + 1`,
            updatedAt: new Date()
          })
          .where(eq(schema.communityNews.id, id));

        const updated = await db.select().from(schema.communityNews).where(eq(schema.communityNews.id, id));
        if (updated[0]) {
          const n = updated[0];
          return {
            id: n.id,
            author: n.author,
            content: n.content,
            time: n.createdAt.toLocaleDateString("fr-FR"),
            type: n.type as any,
            likes: n.likes,
            comments: n.comments,
            wilaya: n.wilaya,
            neighborhood: n.neighborhood
          };
        }
      } catch (err) {
        console.error("PostgreSQL likeNews error:", err);
      }
    }

    const item = fallbackNews.find(n => n.id === id);
    if (item) {
      item.likes += 1;
      return item;
    }
    return null;
  },

  // ==========================================
  // COMMUNITY SERVICES
  // ==========================================
  async getServices(category?: string, wilaya?: string): Promise<HoumaService[]> {
    const db = getDb();
    if (db) {
      try {
        const conditions: any[] = [];
        if (category) conditions.push(eq(schema.communityServices.category, category));
        if (wilaya) conditions.push(eq(schema.communityServices.wilaya, wilaya));

        const records = conditions.length > 0
          ? await db.select().from(schema.communityServices).where(and(...conditions))
          : await db.select().from(schema.communityServices);

        return records.map(s => ({
          id: s.id,
          title: s.title,
          provider: s.provider,
          category: s.category as any,
          description: s.description,
          price: s.price || undefined,
          rating: Number(s.rating),
          phone: s.phone,
          wilaya: s.wilaya,
          neighborhood: s.neighborhood
        }));
      } catch (err) {
        console.error("PostgreSQL getServices error:", err);
      }
    }

    let filtered = [...fallbackServices];
    if (category) filtered = filtered.filter(s => s.category === category);
    if (wilaya) filtered = filtered.filter(s => s.wilaya === wilaya);
    return filtered;
  },

  async createService(data: { title: string; provider: string; phone: string; category?: string; description?: string; price?: string; wilaya?: string; neighborhood?: string }): Promise<HoumaService> {
    const newId = `srv-${Date.now()}`;
    const categoryVal = data.category || "OTHER";
    const wilayaVal = data.wilaya || "16 - Alger";
    const neighborhoodVal = data.neighborhood || "Général";

    const db = getDb();
    if (db) {
      try {
        await db.insert(schema.communityServices).values({
          id: newId,
          title: data.title,
          provider: data.provider,
          category: categoryVal,
          description: data.description || "",
          price: data.price || "Sur devis",
          rating: "5.00",
          phone: data.phone,
          wilaya: wilayaVal,
          neighborhood: neighborhoodVal
        });

        return {
          id: newId,
          title: data.title,
          provider: data.provider,
          category: categoryVal as any,
          description: data.description || "",
          price: data.price || "Sur devis",
          rating: 5.0,
          phone: data.phone,
          wilaya: wilayaVal,
          neighborhood: neighborhoodVal
        };
      } catch (err) {
        console.error("PostgreSQL createService error:", err);
      }
    }

    const item: HoumaService = {
      id: newId,
      title: data.title,
      provider: data.provider,
      category: categoryVal as any,
      description: data.description || "",
      phone: data.phone,
      rating: 5.0,
      wilaya: wilayaVal,
      neighborhood: neighborhoodVal,
      price: data.price || "Sur devis"
    };
    fallbackServices.unshift(item);
    return item;
  },

  // ==========================================
  // CITIZEN REPORTS
  // ==========================================
  async getReports(): Promise<CitizenReport[]> {
    const db = getDb();
    if (db) {
      try {
        const records = await db.select().from(schema.citizenReports).orderBy(desc(schema.citizenReports.createdAt));
        return records.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          category: r.category as any,
          status: r.status as any,
          location: { lat: Number(r.lat), lng: Number(r.lng) },
          author: r.author,
          date: r.createdAt.toLocaleDateString("fr-FR"),
          wilaya: r.wilaya,
          neighborhood: r.neighborhood,
          images: r.images || []
        }));
      } catch (err) {
        console.error("PostgreSQL getReports error:", err);
      }
    }

    return fallbackReports;
  },

  async createReport(data: { title: string; description: string; category?: string; location?: { lat: number; lng: number }; author?: string; wilaya?: string; neighborhood?: string; images?: string[] }): Promise<CitizenReport> {
    const newId = `rep-${Date.now()}`;
    const categoryVal = data.category || "INFRASTRUCTURE";
    const loc = data.location || { lat: 36.7538, lng: 3.0588 };
    const authorVal = data.author || "Habitant Houma";
    const wilayaVal = data.wilaya || "16 - Alger";
    const neighborhoodVal = data.neighborhood || "Général";

    const db = getDb();
    if (db) {
      try {
        await db.insert(schema.citizenReports).values({
          id: newId,
          title: data.title,
          description: data.description,
          category: categoryVal,
          status: "PENDING",
          lat: loc.lat.toFixed(7),
          lng: loc.lng.toFixed(7),
          author: authorVal,
          wilaya: wilayaVal,
          neighborhood: neighborhoodVal,
          images: data.images || []
        });

        return {
          id: newId,
          title: data.title,
          description: data.description,
          category: categoryVal as any,
          status: "PENDING",
          location: loc,
          author: authorVal,
          date: new Date().toLocaleDateString("fr-FR"),
          wilaya: wilayaVal,
          neighborhood: neighborhoodVal,
          images: data.images || []
        };
      } catch (err) {
        console.error("PostgreSQL createReport error:", err);
      }
    }

    const item: CitizenReport = {
      id: newId,
      title: data.title,
      description: data.description,
      category: categoryVal as any,
      status: "PENDING",
      location: loc,
      author: authorVal,
      date: new Date().toLocaleDateString("fr-FR"),
      wilaya: wilayaVal,
      neighborhood: neighborhoodVal,
      images: data.images || []
    };
    fallbackReports.unshift(item);
    return item;
  }
};
