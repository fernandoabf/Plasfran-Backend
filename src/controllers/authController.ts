import type { Context } from "hono";
import {
  loginUser,
  loginWithGoogle,
  refreshTokens,
} from "../services/authService.ts";

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
