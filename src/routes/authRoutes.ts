// src/routes/authRoutes.ts
import { Hono } from "hono";
import { AuthController } from "../controllers/authController.js";

const authController = new AuthController();

const authRoutes = new Hono();

authRoutes.post("/", (req, res) => authController.verifyAuth(req, res));

export default authRoutes;
