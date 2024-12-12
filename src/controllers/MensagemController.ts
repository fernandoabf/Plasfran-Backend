import { Hono } from "hono";
import { MensagemService } from "../services/MensagemService.ts";

const mensagemController = new Hono();
const mensagemService = new MensagemService();

// Rota para adicionar uma mensagem a um parente pelo ID
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

// Rota para buscar as mensagens de um parente pelo ID
mensagemController.get("/:parenteId", async (ctx) => {
  const parenteId = ctx.req.param("parenteId");

  try {
    const mensagens = await mensagemService.getMensagensByParenteId(parenteId);

    if (mensagens.length === 0) {
      return ctx.json({ error: "Nenhuma mensagem foi não encontradas" }, 404);
    }
    return ctx.json({
      message: "Mensagens encontradas com sucesso",
      mensagens,
    });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return ctx.json({ error: "Erro ao buscar mensagens" }, 400);
  }
});

// Rota para deletar uma mensagem pelo ID
mensagemController.delete("/:mensagemId", async (ctx) => {
  const mensagemId = ctx.req.param("mensagemId");

  try {
    await mensagemService.deleteMensagemById(mensagemId);

    return ctx.json({ message: "Mensagem deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar mensagem:", error);
    return ctx.json({ error: "Erro ao deletar mensagem" }, 400);
  }
});

// Rota para editar uma mensagem pelo ID
mensagemController.patch("/:mensagemId", async (ctx) => {
  const mensagemId = ctx.req.param("mensagemId");

  const mensagemData = (await ctx.req.json()) as { mensagem: string };

  try {
    const mensagem = await mensagemService.editMensagemById(
      mensagemId,
      mensagemData.mensagem
    );

    return ctx.json({
      message: "Mensagem editada com sucesso",
      mensagemId: mensagem.mensagemId,
      mensagemEditada: mensagem.mensagem,
    });
  } catch (error) {
    console.error("Erro ao editar mensagem:", error);
    return ctx.json({ error: "Erro ao editar mensagem" }, 400);
  }
});
export default mensagemController;
