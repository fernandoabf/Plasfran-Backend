import "reflect-metadata"; // Deve ser importado antes de qualquer entidade ou uso do TypeORM
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { AppDataSource } from "./database/ormconfig.js";
import { cors } from "hono/cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.ts";
import protectedRoutes from "./routes/protectedRoutes.ts";

dotenv.config();

const app = new Hono();

app.use(cors({ origin: "*" }));

app.route("/api", protectedRoutes);

app.route("/auth", authRoutes);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

AppDataSource.initialize()
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((error) => {
    console.error("Erro na conexão com o banco de dados:", error);
  });

serve({
  fetch: app.fetch,
  port,
});
