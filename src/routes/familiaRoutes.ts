// routes/familiaRoutes.ts
import { Hono } from "hono";
import familiaController from "../controllers/FamiliaController.js";

const familiaRoutes = new Hono();

// Integrando as rotas de família
familiaRoutes.route("/", familiaController);

export default familiaRoutes;
