// routes/familiaRoutes.ts
import { Hono } from "hono";
import mensagemController from "../controllers/MensagemController.ts";

const mensagemRoutes = new Hono();

// Integrando as rotas de família
mensagemRoutes.route("/", mensagemController);

export default mensagemRoutes;
