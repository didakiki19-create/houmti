import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import dotenv from "dotenv";

// Load environment variables if running outside Vercel
dotenv.config();

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let poolInstance: Pool | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  if (!dbInstance) {
    try {
      // In serverless / edge environments, configure ws if needed
      poolInstance = new Pool({ 
        connectionString: databaseUrl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });

      dbInstance = drizzle(poolInstance, { schema });
    } catch (err) {
      console.error("Failed to initialize PostgreSQL pool:", err);
      return null;
    }
  }

  return dbInstance;
}

export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string; latencyMs?: number }> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return { connected: false, error: "DATABASE_URL environment variable is not defined" };
  }

  const start = Date.now();
  const db = getDb();
  if (!db || !poolInstance) {
    return { connected: false, error: "Could not create database connection pool" };
  }

  try {
    const client = await poolInstance.connect();
    try {
      await client.query("SELECT 1");
      const latencyMs = Date.now() - start;
      return { connected: true, latencyMs };
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("PostgreSQL health check failed:", err.message);
    return { connected: false, error: err.message };
  }
}

export { schema };
