// Ficheiro: src/lib/db.ts
import { Pool } from "pg";

const connectionString =
  "postgresql://neondb_owner:npg_gXO8mVk6MdJP@ep-empty-wind-acljaddl-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({
  connectionString,
});

console.log("Pool de conexões com o banco de dados criado com sucesso!");
