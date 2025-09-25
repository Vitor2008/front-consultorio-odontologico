// import dotenv from "dotenv";
import * as dotenv from 'dotenv';
dotenv.config();

import fastify from "fastify";
import registerAllRoutes from "./routes/routes";
import cors from "@fastify/cors";

const app = fastify();

app.register(cors, {
  origin: process.env.URL_FRONT, // Permite requisições APENAS do seu frontend Vite
});

app.register(registerAllRoutes);

const PORT = 8123;

app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
