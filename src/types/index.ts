import type { Context } from "hono";
import { User } from "../entity/User"; // Ajuste para o tipo correto de User

export interface CustomContext extends Context {
  state: {
    usuarioId: number; // Adapte conforme o tipo do ID do seu usuário
  };
  user: User; // Aqui definimos que o 'user' estará disponível no contexto
}
