import { Hono } from "hono";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.ts";

const protectedRoutes = new Hono();

protectedRoutes.use("*", authenticateToken);

protectedRoutes.get("/profile", (c) => {
  const user = c.req.param("user");
  return c.json({ message: "Acesso autorizado", user });
});

// Rota apenas para administradores
protectedRoutes.get("/admin", isAdmin, (c) => {
  return c.json({ message: "Bem-vindo, administrador!" });
});

export default protectedRoutes;
