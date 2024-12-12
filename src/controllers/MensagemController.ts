import { Hono } from "hono";
import { MensagemService } from "../services/MensagemService.ts";

const mensagemController = new Hono();
const mensagemService = new MensagemService();

mensagemController.post("/:parenteId", async (ctx) => {
  const parenteId = ctx.req.param("parenteId");

  const mensagemData = await ctx.req.json();

  try {
    const mensagem = await mensagemService.addMensagemToParente(
      parenteId,
      mensagemData.nome,
      mensagemData.mensagem
    );

    return ctx.json({
      message: "Mensagem adicionada com sucesso",
      mensagemId: mensagem.mensagemId,
    });
  } catch (error) {
    console.error("Erro ao adicionar mensagem:", error);
    return ctx.json({ error: "Erro ao adicionar a mensagem" }, 400);
  }
});

mensagemController.get("/:parenteId", async (ctx) => {
  const parenteId = ctx.req.param("parenteId");

  try {
    const mensagens = await mensagemService.getMensagesByParenteId(parenteId);

    return ctx.json({
      message: "Mensagens encontradas com sucesso",
      mensagens,
    });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return ctx.json({ error: "Erro ao buscar mensagens" }, 400);
  }
});
export default mensagemController;
