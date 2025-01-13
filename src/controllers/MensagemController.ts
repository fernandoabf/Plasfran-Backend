import { Hono } from "hono";
import { MensagemService } from "../services/MensagemService.js";
import { canEditOrDeleteMessage } from "../middlewares/authMiddleware.js";

const mensagemController = new Hono();
const mensagemService = new MensagemService();

// Rota para buscar mensagens de um parente pelo ID
mensagemController.get("/:parenteId", async (ctx) => {
  const parenteId = ctx.req.param("parenteId");

  try {
    const mensagens = await mensagemService.getMensagensByParenteId(parenteId);

    // Se não houver mensagens, retorne um array vazio
    if (mensagens.length === 0) {
      return ctx.json({ message: "Não há mensagens para este parente." }, 200); // Retorna array vazio com uma mensagem de sucesso
    }

    // Caso contrário, retorne as mensagens encontradas
    return ctx.json({
      message: "Mensagens encontradas com sucesso",
      mensagens,
    });
  } catch (error: any) {
    console.error("Erro ao buscar mensagens:", error);
    return ctx.json(
      { error: "Erro ao carregar mensagens. Tente novamente." },
      500 // Código de erro 500 para falha no servidor
    );
  }
});

// Rota para adicionar uma mensagem a um parente pelo ID
mensagemController.post("/:parenteId", async (ctx) => {
  const parenteId = ctx.req.param("parenteId");
  const mensagemData = await ctx.req.json();

  try {
    const mensagem = await mensagemService.addMensagemToParente(
      parenteId,
      mensagemData.nome,
      mensagemData.mensagem,
      mensagemData.email
    );

    return ctx.json({
      message: "Mensagem adicionada com sucesso",
      mensagemId: mensagem.mensagemId,
    });
  } catch (error: any) {
    console.error("Erro ao adicionar mensagem:", error);
    return ctx.json(
      { error: "Erro ao adicionar a mensagem. Tente novamente." },
      400 // Código de erro 400 para solicitação inválida
    );
  }
});

mensagemController.use("/*", canEditOrDeleteMessage);

// Rota para deletar uma mensagem pelo ID
mensagemController.delete("/:mensagemId", async (ctx) => {
  const mensagemId = ctx.req.param("mensagemId");

  try {
    await mensagemService.deleteMensagemById(mensagemId);

    return ctx.json({ message: "Mensagem deletada com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar mensagem:", error);
    return ctx.json(
      { error: "Erro ao deletar a mensagem. Tente novamente." },
      400 // Código de erro 400 para solicitação inválida
    );
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
  } catch (error: any) {
    console.error("Erro ao editar mensagem:", error);
    return ctx.json(
      { error: "Erro ao editar a mensagem. Tente novamente." },
      400 // Código de erro 400 para solicitação inválida
    );
  }
});

export default mensagemController;
