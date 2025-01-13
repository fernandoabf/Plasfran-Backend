import type { Context } from "hono";
import {
  loginUser,
  loginWithGoogle,
  refreshTokens,
  registerEmployee,
} from "../services/authService.js";

export const loginController = async (c: Context) => {
  const { email, password } = await c.req.json();

  try {
    const result = await loginUser(email, password);

    if (!result.success) {
      return c.json({ error: result.message }, 401); // Unauthorized
    }

    // Agora retorna tanto o accessToken quanto o refreshToken
    return c.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    console.error("Erro ao realizar login:", error);
    return c.json({ error: "Erro ao realizar login. Tente novamente." }, 500); // Internal Server Error
  }
};

export const googleLoginController = async (c: Context) => {
  const { idToken } = await c.req.json();

  try {
    const result = await loginWithGoogle(idToken);

    if (!result.success) {
      return c.json({ error: result.message }, 401); // Unauthorized
    }

    // Agora retorna tanto o accessToken quanto o refreshToken
    return c.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    console.error("Erro ao realizar login com Google:", error);
    return c.json(
      { error: "Erro ao realizar login com Google. Tente novamente." },
      500
    ); // Internal Server Error
  }
};

export const refreshTokensController = async (c: Context) => {
  const { refreshToken } = await c.req.json();

  try {
    const result = await refreshTokens(refreshToken);

    if (!result.success) {
      return c.json({ error: result.message }, 401); // Unauthorized
    }

    return c.json({
      accessToken: result.accessToken, // Novo Access Token
      refreshToken: result.refreshToken, // O mesmo Refresh Token
    });
  } catch (error: any) {
    console.error("Erro ao atualizar tokens:", error);
    return c.json({ error: "Erro ao atualizar tokens. Tente novamente." }, 500); // Internal Server Error
  }
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
      403 // Forbidden
    );
  }

  const { email, password, name, role } = await c.req.json();

  try {
    const result = await registerEmployee(email, password, name, role);

    if (!result.success) {
      return c.json({ error: result.message }, 400); // Bad Request
    }

    return c.json({ message: result.message }, 201); // Created
  } catch (error: any) {
    console.error("Erro ao registrar funcionário:", error);
    return c.json(
      { error: "Erro ao registrar funcionário. Tente novamente." },
      500
    ); // Internal Server Error
  }
};
