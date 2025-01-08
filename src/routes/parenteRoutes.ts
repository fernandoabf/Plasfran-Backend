// routes/familiaRoutes.ts
import { Hono } from "hono";
import parenteController from "../controllers/ParenteController.js";

const parenteRoutes = new Hono();

// Integrando as rotas de família
parenteRoutes.route("/parente", parenteController);

export default parenteRoutes;
