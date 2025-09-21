import dotenv from "dotenv";
dotenv.config();

import fastify from "fastify";
import routes from "./routes/routes";
import cors from "@fastify/cors";

const app = fastify();

app.register(cors, {
  origin: "http://localhost:5173", // Permite requisições APENAS do seu frontend Vite
});

app.register(routes);

const PORT = 8888;

app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
