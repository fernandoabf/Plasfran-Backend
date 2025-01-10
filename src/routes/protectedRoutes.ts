import { Hono } from "hono";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import parenteController from "../controllers/ParenteController.js";
import mensagemController from "../controllers/MensagemController.js";
import familiaController from "../controllers/FamiliaController.js";

const protectedRoutes = new Hono();

protectedRoutes.use("*", authenticateToken);

protectedRoutes.route("/familia", familiaController);
protectedRoutes.route("/mensagem", mensagemController);
protectedRoutes.route("/parente", parenteController);

export default protectedRoutes;
