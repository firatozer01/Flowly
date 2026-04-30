import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  // Remove channel_binding param — not supported by the HTTP driver
  const cleanUrl = url.replace(/[&?]channel_binding=[^&]*/g, "").replace(/\?&/, "?");
  const sql = neon(cleanUrl);
  return drizzle(sql, { schema });
}

export const db = createDb();
