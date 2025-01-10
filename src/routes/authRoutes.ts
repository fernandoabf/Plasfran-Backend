import { Hono } from "hono";
import {
  loginController,
  googleLoginController,
  refreshTokensController,
  registerEmployeeController,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const authRoutes = new Hono();

authRoutes.post("/login", loginController);
authRoutes.post("/google", googleLoginController);
authRoutes.post("/register", authenticateToken, registerEmployeeController);
authRoutes.post("/refresh-token", refreshTokensController);

export default authRoutes;
