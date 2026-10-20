import { getDb, schema } from "./index";
import { 
  MOCK_STORES, 
  MOCK_PRODUCTS, 
  MOCK_NEWS, 
  MOCK_SERVICES, 
  MOCK_REPORTS 
} from "../constants";

export async function runSeed() {
  const db = getDb();
  if (!db) {
    console.error("❌ Impossible d'exécuter le seed: DATABASE_URL n'est pas configuré.");
    return false;
  }

  console.log("🌱 Début du seed PostgreSQL pour Hoomty...");

  try {
    // 1. Seed Utilisateur Démo
    console.log("-> Seeding utilisateur démo...");
    const demoUserId = "usr-demo-1";
    await db.insert(schema.users).values({
      id: demoUserId,
      pseudonym: "Amine_DZ",
      name: "Amine Benali",
      email: "amine@hoomty.dz",
      phone: "+213550123456",
      role: "CLIENT",
      points: 450,
      wilaya: "16 - Alger",
      neighborhood: "El Biar",
      lang: "fr",
      theme: "light",
      businessType: null,
    }).onConflictDoUpdate({
      target: schema.users.id,
      set: {
        points: 450,
        updatedAt: new Date()
      }
    });

    // 2. Seed Adresses Démo
    console.log("-> Seeding adresses démo...");
    await db.insert(schema.addresses).values([
      {
        id: "addr-1",
        userId: demoUserId,
        label: "Maison",
        details: "Résidence Les Pins, Bât C, Apt 14",
        wilaya: "16 - Alger",
        neighborhood: "El Biar"
      },
      {
        id: "addr-2",
        userId: demoUserId,
        label: "Bureau",
        details: "Boulevard du 11 Décembre 1960",
        wilaya: "16 - Alger",
        neighborhood: "Ben Aknoun"
      }
    ]).onConflictDoNothing({ target: schema.addresses.id });

    // 3. Seed Boutiques (Stores)
    console.log(`-> Seeding ${MOCK_STORES.length} boutiques...`);
    for (const store of MOCK_STORES) {
      await db.insert(schema.stores).values({
        id: store.id,
        name: store.name,
        category: store.category,
        distance: store.distance,
        rating: store.rating.toString(),
        hours: store.hours,
        image: store.image,
        wilaya: store.wilaya,
        neighborhood: store.neighborhood,
        description: store.description || `Commerce de proximité de votre quartier à ${store.neighborhood}.`,
        phone: store.phone || "+213550000000",
        lat: store.lat ? store.lat.toString() : "36.7525000",
        lng: store.lng ? store.lng.toString() : "3.0419700"
      }).onConflictDoUpdate({
        target: schema.stores.id,
        set: {
          name: store.name,
          category: store.category,
          hours: store.hours,
          image: store.image,
          wilaya: store.wilaya,
          neighborhood: store.neighborhood,
          rating: store.rating.toString(),
          phone: store.phone || "+213550000000",
          updatedAt: new Date()
        }
      });
    }

    // 4. Seed Produits (Products)
    console.log(`-> Seeding ${MOCK_PRODUCTS.length} produits...`);
    for (const prod of MOCK_PRODUCTS) {
      await db.insert(schema.products).values({
        id: prod.id,
        storeId: prod.storeId,
        name: prod.name,
        price: prod.price.toFixed(2),
        category: prod.category,
        origin: prod.origin,
        image: prod.image,
        stock: prod.stock,
      }).onConflictDoUpdate({
        target: schema.products.id,
        set: {
          name: prod.name,
          price: prod.price.toFixed(2),
          category: prod.category,
          origin: prod.origin,
          image: prod.image,
          stock: prod.stock,
          updatedAt: new Date()
        }
      });
    }

    // 5. Seed Actualités de Quartier (Community News)
    console.log(`-> Seeding ${MOCK_NEWS.length} actualités...`);
    for (const item of MOCK_NEWS) {
      await db.insert(schema.communityNews).values({
        id: item.id,
        author: item.author,
        content: item.content,
        type: item.type,
        likes: item.likes,
        comments: item.comments,
        wilaya: item.wilaya,
        neighborhood: item.neighborhood
      }).onConflictDoNothing({ target: schema.communityNews.id });
    }

    // 6. Seed Services de Quartier (Community Services)
    console.log(`-> Seeding ${MOCK_SERVICES.length} services...`);
    for (const service of MOCK_SERVICES) {
      await db.insert(schema.communityServices).values({
        id: service.id,
        title: service.title,
        provider: service.provider,
        category: service.category,
        description: service.description,
        price: service.price || "Sur devis",
        rating: service.rating.toString(),
        phone: service.phone,
        wilaya: service.wilaya,
        neighborhood: service.neighborhood
      }).onConflictDoNothing({ target: schema.communityServices.id });
    }

    // 7. Seed Signalements Citoyens (Citizen Reports)
    console.log(`-> Seeding ${MOCK_REPORTS.length} signalements citoyens...`);
    for (const rep of MOCK_REPORTS) {
      await db.insert(schema.citizenReports).values({
        id: rep.id,
        title: rep.title,
        description: rep.description,
        category: rep.category,
        status: rep.status,
        lat: rep.location.lat.toString(),
        lng: rep.location.lng.toString(),
        author: rep.author,
        wilaya: rep.wilaya,
        neighborhood: rep.neighborhood,
        images: rep.images || []
      }).onConflictDoNothing({ target: schema.citizenReports.id });
    }

    console.log("✅ Seed PostgreSQL terminé avec succès et idempotence garantie !");
    return true;
  } catch (error) {
    console.error("❌ Erreur pendant le seed :", error);
    throw error;
  }
}

// Direct execution when called via CLI
if (process.argv[1]?.includes("seed")) {
  runSeed().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
