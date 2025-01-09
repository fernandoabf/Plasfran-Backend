import { Hono } from "hono";
import {
  loginController,
  googleLoginController,
  refreshTokensController,
  registerEmployeeController,
} from "../controllers/authController.ts";
import { authenticateToken } from "../middlewares/authMiddleware.ts";

const authRoutes = new Hono();

authRoutes.post("/login", loginController);
authRoutes.post("/google", googleLoginController);
authRoutes.post("/register", authenticateToken, registerEmployeeController);
authRoutes.post("/refresh-token", refreshTokensController);

export default authRoutes;
