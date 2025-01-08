import jwt from "jsonwebtoken";
import type { Context } from "hono";
import { User } from "../entity/User.ts";

import dotenv from "dotenv";
dotenv.config();

export const authenticateToken = async (c: Context, next: Function) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return c.json({ error: "Token não fornecido" }, 401);

  try {
    if (!process.env.JWT_SECRET) {
      return c.json({ error: "JWT_SECRET não definido" }, 500);
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET) as unknown as {
      id: number;
    };
    const user = await User.findOne({ where: { id: payload.id } });

    if (!user) return c.json({ error: "Usuário não encontrado" }, 404);

    c.set("user", user); // Salva o usuário no contexto
    await next();
  } catch (error) {
    return c.json({ error: "Token inválido" }, 403);
  }
};

export const isAdmin = async (c: Context, next: Function) => {
  const user = c.get("user");

  if (user.role !== "admin") {
    return c.json({ error: "Acesso não autorizado" }, 403);
  }

  await next();
};
