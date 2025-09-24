import { Pool } from "pg";
// import dotenv from "dotenv";
import * as dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

console.log("Pool de conexões com o banco de dados criado com sucesso!");
