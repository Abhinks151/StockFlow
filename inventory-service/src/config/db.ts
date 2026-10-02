import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/stockflow_inventory?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected via Prisma");
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
  }
}

