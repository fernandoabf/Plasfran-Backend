import jwt from "jsonwebtoken";
import type { Context } from "hono";
import dotenv from "dotenv";
import { AppDataSource } from "../database/ormconfig.ts";
import { User } from "../entity/User.ts";
import { Employee } from "../entity/Employee.ts";
import { Mensagem } from "../entity/Mensagem.ts";

dotenv.config();

export const authenticateToken = async (c: Context, next: Function) => {
  // Verifica se o header de Authorization foi fornecido
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Token não fornecido" }, 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) return c.json({ error: "Token não fornecido" }, 401);

  try {
    // Verifica se a chave JWT_SECRET está definida
    if (!process.env.JWT_SECRET) {
      return c.json({ error: "JWT_SECRET não definido" }, 500);
    }

    // Decodifica o payload do token
    const payload = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    // Verifica se o usuário existe na tabela User
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: payload.id },
    });

    // Se o usuário não for encontrado, tenta buscar o employee
    if (!user) {
      const employee = await AppDataSource.getRepository(Employee).findOne({
        where: { id: payload.id },
      });

      if (!employee) {
        return c.json({ error: "Usuário não encontrado" }, 404);
      }

      // Se o employee for encontrado, armazena no contexto
      c.set("user", employee);
    } else {
      // Se o usuário for encontrado, armazena no contexto
      c.set("user", user);
    }

    await next();
  } catch (error: any) {
    // Se ocorrer um erro ao verificar ou decodificar o token
    return c.json({ error: "Token inválido", details: error.message }, 403);
  }
};

export const canEditOrDeleteMessage = async (c: Context, next: Function) => {
  // Recuperar a mensagem com base no ID da URL ou do corpo da requisição
  const mensagemRepository = AppDataSource.getRepository(Mensagem);

  const messageId = c.req.param("mensagemId"); // ou outro jeito de capturar o ID da mensagem
  const message = await mensagemRepository.findOne({
    where: { mensagemId: messageId, excluido: false },
  });

  if (!message) {
    return c.json({ error: "Mensagem não encontrada" }, 404);
  }

  // Obter o usuário do contexto
  const user = c.get("user");

  // Verificar se o usuário é o autor da mensagem ou se é um admin/employee
  console.log(message.owner);
  if (
    message.owner !== user.id &&
    user.role !== "admin" &&
    user.role !== "employee"
  ) {
    return c.json({ error: "Acesso não autorizado" }, 403); // Se não for o autor nem admin/employee
  }

  // Se a verificação passar, continue com a ação (editar/deletar)
  await next();
};

export const isAdminOrEmployee = async (c: Context, next: Function) => {
  const user = c.get("user");
  console.log(user);
  if (!user || (user.role !== "admin" && user.role !== "employee")) {
    return c.json({ error: "Acesso não autorizado" }, 403);
  }

  await next();
};

export const isAdmin = async (c: Context, next: Function) => {
  const user = c.get("user");

  if (user.role !== "admin") {
    return c.json({ error: "Acesso não autorizado" }, 403);
  }

  await next();
};
