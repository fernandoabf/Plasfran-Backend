import type { Context } from "hono";
import {
  loginUser,
  loginWithGoogle,
  refreshTokens,
  registerEmployee,
} from "../services/authService.js";

export const loginController = async (c: Context) => {
  const { email, password } = await c.req.json();

  const result = await loginUser(email, password);

  if (!result.success) {
    return c.json({ error: result.message }, 401);
  }

  // Agora retorna tanto o accessToken quanto o refreshToken
  return c.json({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
};

export const googleLoginController = async (c: Context) => {
  const { idToken } = await c.req.json();

  const result = await loginWithGoogle(idToken);

  if (!result.success) {
    return c.json({ error: result.message }, 401);
  }

  // Agora retorna tanto o accessToken quanto o refreshToken
  return c.json({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
};

export const refreshTokensController = async (c: Context) => {
  const { refreshToken } = await c.req.json();

  const result = await refreshTokens(refreshToken);

  if (!result.success) {
    return c.json({ error: result.message }, 401);
  }

  return c.json({
    accessToken: result.accessToken, // Novo Access Token
    refreshToken: result.refreshToken, // O mesmo Refresh Token
  });
};

export const registerEmployeeController = async (c: Context) => {
  const user = c.get("user"); // Obtém o usuário autenticado a partir do contexto

  // Verifica se o usuário tem permissão de admin
  if (user.role !== "admin") {
    return c.json(
      {
        error:
          "Acesso não autorizado. Apenas administradores podem criar contas.",
      },
      403
    );
  }

  const { email, password, name, role } = await c.req.json();

  const result = await registerEmployee(email, password, name, role);

  if (!result.success) {
    return c.json({ error: result.message }, 400);
  }

  return c.json({ message: result.message }, 201);
};
