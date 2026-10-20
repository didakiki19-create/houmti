import { Router, Request, Response } from "express";
import { dbService } from "./db-service";

export const apiRouter = Router();

// ==========================================
// 1. HEALTH CHECK
// ==========================================
apiRouter.get("/health", async (_req: Request, res: Response) => {
  try {
    const health = await dbService.getHealth();
    res.json(health);
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

// ==========================================
// 2. AUTHENTICATION & PROFILES
// ==========================================
apiRouter.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { pseudonym, role } = req.body;
    if (!pseudonym) {
      return res.status(400).json({ error: "Pseudonyme requis" });
    }
    const user = await dbService.loginOrRegister(pseudonym, role);
    res.json({ success: true, user });
  } catch (err) {
    console.error("Auth login error:", err);
    res.status(500).json({ error: "Erreur d'authentification" });
  }
});

// ==========================================
// 3. STORES
// ==========================================
apiRouter.get("/stores", async (req: Request, res: Response) => {
  try {
    const { category, wilaya, neighborhood, search } = req.query;
    const stores = await dbService.getStores({
      category: category ? String(category) : undefined,
      wilaya: wilaya ? String(wilaya) : undefined,
      neighborhood: neighborhood ? String(neighborhood) : undefined,
      search: search ? String(search) : undefined
    });
    res.json(stores);
  } catch (err) {
    console.error("Stores fetch error:", err);
    res.status(500).json({ error: "Impossible de récupérer les boutiques" });
  }
});

apiRouter.get("/stores/:id", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const store = await dbService.getStoreById(id);
    if (!store) {
      return res.status(404).json({ error: "Boutique non trouvée" });
    }
    res.json(store);
  } catch (err) {
    console.error("Store detail fetch error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ==========================================
// 4. PRODUCTS
// ==========================================
apiRouter.get("/products", async (req: Request, res: Response) => {
  try {
    const { storeId, category, origin, search } = req.query;
    const products = await dbService.getProducts({
      storeId: storeId ? String(storeId) : undefined,
      category: category ? String(category) : undefined,
      origin: origin ? String(origin) : undefined,
      search: search ? String(search) : undefined
    });
    res.json(products);
  } catch (err) {
    console.error("Products fetch error:", err);
    res.status(500).json({ error: "Impossible de récupérer les produits" });
  }
});

apiRouter.post("/products", async (req: Request, res: Response) => {
  try {
    const { name, price, category, storeId, origin, image, stock } = req.body;
    if (!name || price === undefined || !storeId) {
      return res.status(400).json({ error: "Champs requis manquants (nom, prix, boutique)" });
    }
    const product = await dbService.createProduct({
      name,
      price: Number(price),
      storeId,
      category,
      origin,
      image,
      stock: stock ? Number(stock) : undefined
    });
    res.status(201).json(product);
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({ error: "Impossible de créer le produit" });
  }
});

// ==========================================
// 5. ORDERS (ACID TRANSACTIONS)
// ==========================================
apiRouter.get("/orders", async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const orders = await dbService.getOrders(status ? String(status) : undefined);
    res.json(orders);
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ error: "Impossible de récupérer les commandes" });
  }
});

apiRouter.post("/orders", async (req: Request, res: Response) => {
  try {
    const { items, total, address, storeName, userId } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: "Le panier est vide" });
    }
    const newOrder = await dbService.createOrder({
      items,
      total: Number(total) || 0,
      address,
      storeName,
      userId
    });
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ error: "Échec de l'enregistrement de la commande" });
  }
});

apiRouter.patch("/orders/:id/status", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Statut manquant" });
    }
    const updated = await dbService.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Order status update error:", err);
    res.status(500).json({ error: "Erreur de mise à jour du statut" });
  }
});

// ==========================================
// 6. COMMUNITY NEWS
// ==========================================
apiRouter.get("/community/news", async (req: Request, res: Response) => {
  try {
    const { wilaya, neighborhood } = req.query;
    const news = await dbService.getNews(
      wilaya ? String(wilaya) : undefined,
      neighborhood ? String(neighborhood) : undefined
    );
    res.json(news);
  } catch (err) {
    console.error("Community news fetch error:", err);
    res.status(500).json({ error: "Impossible de charger les actualités" });
  }
});

apiRouter.post("/community/news", async (req: Request, res: Response) => {
  try {
    const { author, content, type, wilaya, neighborhood } = req.body;
    if (!content || !author) {
      return res.status(400).json({ error: "Contenu et auteur requis" });
    }
    const item = await dbService.createNews({ author, content, type, wilaya, neighborhood });
    res.status(201).json(item);
  } catch (err) {
    console.error("Community news creation error:", err);
    res.status(500).json({ error: "Erreur lors de la publication" });
  }
});

apiRouter.post("/community/news/:id/like", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await dbService.likeNews(id);
    if (!item) {
      return res.status(404).json({ error: "Publication non trouvée" });
    }
    res.json(item);
  } catch (err) {
    console.error("Like news error:", err);
    res.status(500).json({ error: "Erreur lors du vote" });
  }
});

// ==========================================
// 7. COMMUNITY SERVICES
// ==========================================
apiRouter.get("/community/services", async (req: Request, res: Response) => {
  try {
    const { category, wilaya } = req.query;
    const services = await dbService.getServices(
      category ? String(category) : undefined,
      wilaya ? String(wilaya) : undefined
    );
    res.json(services);
  } catch (err) {
    console.error("Community services fetch error:", err);
    res.status(500).json({ error: "Impossible de récupérer les services" });
  }
});

apiRouter.post("/community/services", async (req: Request, res: Response) => {
  try {
    const { title, provider, category, description, phone, wilaya, neighborhood, price } = req.body;
    if (!title || !provider || !phone) {
      return res.status(400).json({ error: "Informations requises manquantes" });
    }
    const item = await dbService.createService({
      title,
      provider,
      phone,
      category,
      description,
      price,
      wilaya,
      neighborhood
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Community service creation error:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout du service" });
  }
});

// ==========================================
// 8. CITIZEN REPORTS
// ==========================================
apiRouter.get("/community/reports", async (_req: Request, res: Response) => {
  try {
    const reports = await dbService.getReports();
    res.json(reports);
  } catch (err) {
    console.error("Citizen reports fetch error:", err);
    res.status(500).json({ error: "Impossible de récupérer les signalements" });
  }
});

apiRouter.post("/community/reports", async (req: Request, res: Response) => {
  try {
    const { title, description, category, location, author, wilaya, neighborhood, images } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Titre et description requis" });
    }
    const item = await dbService.createReport({
      title,
      description,
      category,
      location,
      author,
      wilaya,
      neighborhood,
      images
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Citizen report creation error:", err);
    res.status(500).json({ error: "Erreur lors du signalement" });
  }
});
