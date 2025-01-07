import "reflect-metadata"; // Deve ser importado antes de qualquer entidade ou uso do TypeORM
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { AppDataSource } from "./database/ormconfig.js";

import familiaRoutes from "./routes/familiaRoutes.js";
import parenteRoutes from "./routes/parenteRoutes.js";
import mensagemRoutes from "./routes/mensagemRoutes.ts";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({ origin: "*" }));
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/familia", familiaRoutes);
app.route("/parente", parenteRoutes);
app.route("/mensagem", mensagemRoutes);

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
