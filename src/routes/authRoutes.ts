import { Hono } from "hono";
import {
  loginController,
  googleLoginController,
  refreshTokensController,
} from "../controllers/authController.ts";

const authRoutes = new Hono();

authRoutes.post("/login", loginController);
authRoutes.post("/google", googleLoginController);
authRoutes.post("/refresh-token", refreshTokensController);

export default authRoutes;
