import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { getDb } from "./index";
import path from "path";

export async function runMigrations() {
  const db = getDb();
  if (!db) {
    console.error("❌ Impossible de migrer: DATABASE_URL n'est pas configuré.");
    return false;
  }

  console.log("🚀 Lancement des migrations PostgreSQL...");
  try {
    await migrate(db, { migrationsFolder: path.resolve(process.cwd(), "drizzle") });
    console.log("✅ Migrations exécutées avec succès !");
    return true;
  } catch (err) {
    console.error("❌ Erreur pendant la migration :", err);
    throw err;
  }
}

if (process.argv[1]?.includes("migrate")) {
  runMigrations().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
