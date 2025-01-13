import { Hono } from "hono";
import { ParenteService } from "../services/ParenteService.js";
import { isAdminOrEmployee } from "../middlewares/authMiddleware.js";

// Instancia o controlador de rotas
const parenteController = new Hono();
const parenteService = new ParenteService();

// Define a interface para o corpo da requisição
interface ParenteRequest {
  nome: string;
  fotoFalecido: string;
  dataNascimento: string;
  dataObito: string;
  mensagemObito: string;
  editadoData?: string;
  excluido: boolean;
  statusConta: string;
  privada: boolean;
  whitelist: string[];
}

// Rota para buscar os parentes de uma família pelo número de contrato
parenteController.get("/contrato/:numeroContrato", async (ctx) => {
  const numeroContrato = parseInt(ctx.req.param("numeroContrato")); // Obtém o número do contrato da URL

  try {
    const parentes = await parenteService.getParentesByContrato(numeroContrato);

    if (parentes.length === 0) {
      return ctx.json(
        { error: "Nenhum parente encontrado para este contrato." },
        404
      );
    }

    return ctx.json({
      message: "Parentes encontrados com sucesso",
      parentes,
    });
  } catch (error: any) {
    console.error("Erro ao buscar parentes:", error);
    return ctx.json(
      { error: "Erro ao buscar parentes. Tente novamente." },
      500
    );
  }
});

// Rota para buscar um parente pelo ID
parenteController.get("/:parenteID", async (ctx) => {
  const parenteID = ctx.req.param("parenteID");

  try {
    const parente = await parenteService.getParentesByID(parenteID);

    if (!parente) {
      return ctx.json({ error: "Parente não encontrado." }, 404);
    }

    return ctx.json({
      message: "Parente encontrado com sucesso",
      parente,
    });
  } catch (error: any) {
    console.error("Erro ao buscar parente:", error);
    return ctx.json({ error: "Erro ao buscar parente. Tente novamente." }, 500);
  }
});

parenteController.use("/*", isAdminOrEmployee);
// Rota para adicionar um parente ao número de contrato
parenteController.post("/:numeroContrato", async (ctx) => {
  const numeroContrato = parseInt(ctx.req.param("numeroContrato"), 10);

  const parenteData: ParenteRequest = await ctx.req.json();

  try {
    // Validações básicas
    if (!parenteData.nome || !parenteData.dataNascimento) {
      return ctx.json(
        {
          error: "Dados inválidos: nome e data de nascimento são obrigatórios.",
        },
        400
      );
    }

    const parente = await parenteService.addParenteToFamiliaByContrato(
      numeroContrato,
      parenteData.nome,
      parenteData.fotoFalecido,
      parenteData.dataNascimento,
      parenteData.dataObito,
      parenteData.mensagemObito,
      parenteData.statusConta || "inativo",
      parenteData.privada || false,
      parenteData.whitelist || []
    );

    return ctx.json({
      message: "Parente adicionado com sucesso",
      parenteId: parente.parenteId,
    });
  } catch (error: any) {
    console.error("Erro ao adicionar parente:", error);
    return ctx.json(
      { error: "Erro ao adicionar parente. Tente novamente." },
      500
    );
  }
});

// Rota para editar um parente pelo ID
parenteController.patch("/:parenteID", async (ctx) => {
  const parenteID = ctx.req.param("parenteID");

  const parenteData: ParenteRequest = await ctx.req.json();

  try {
    const parente = await parenteService.editParenteById(parenteID, {
      ...parenteData,
      statusConta: parenteData.statusConta || "inativo",
    });

    if (!parente) {
      return ctx.json({ error: "Parente não encontrado para edição." }, 404);
    }

    return ctx.json({
      message: "Parente editado com sucesso",
      parenteId: parente.parenteId,
    });
  } catch (error: any) {
    console.error("Erro ao editar parente:", error);
    return ctx.json({ error: "Erro ao editar parente. Tente novamente." }, 500);
  }
});

// Rota para deletar um parente pelo ID
parenteController.delete("/:parenteID", async (ctx) => {
  const parenteID = ctx.req.param("parenteID");

  try {
    const deletedParente = await parenteService.deleteParenteById(parenteID);

    if (!deletedParente) {
      return ctx.json({ error: "Parente não encontrado para exclusão." }, 404);
    }

    return ctx.json({ message: "Parente deletado com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar parente:", error);
    return ctx.json(
      { error: "Erro ao deletar parente. Tente novamente." },
      500
    );
  }
});

export default parenteController;
