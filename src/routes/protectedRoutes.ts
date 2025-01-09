import { Hono } from "hono";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.ts";
import parenteController from "../controllers/ParenteController.ts";
import mensagemController from "../controllers/MensagemController.ts";
import familiaController from "../controllers/FamiliaController.ts";

const protectedRoutes = new Hono();

protectedRoutes.use("*", authenticateToken);

protectedRoutes.route("/familia", familiaController);
protectedRoutes.route("/mensagem", mensagemController);
protectedRoutes.route("/parente", parenteController);

export default protectedRoutes;
