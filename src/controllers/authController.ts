// src/controllers/authController.ts
import { AuthService } from "../services/authService.js";
import type { Context } from "hono";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async verifyAuth(ctx: Context, res: unknown): Promise<Response> {
    // Acessa diretamente os cabeçalhos da requisição no Hono
    const idToken = ctx.req.header("idToken");

    if (!idToken) {
      return ctx.json({ error: "idToken é necessário" }, 400);
    }

    const isValid = await this.authService.verifyIdToken(idToken);

    if (isValid) {
      return ctx.json({ message: "Autenticação bem-sucedida" }, 200);
    } else {
      return ctx.json({ error: "Token inválido" }, 401);
    }
  }
}
