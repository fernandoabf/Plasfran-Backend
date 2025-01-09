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

    return ctx.json({
      message: "Parentes encontrados com sucesso",
      parentes,
    });
  } catch (error: any) {
    console.error("Erro ao buscar parentes:", error);
    return ctx.json({ error: error.message }, 400);
  }
});

// Rota para buscar um parente pelo ID
parenteController.get("/:parenteID", async (ctx) => {
  const parenteID = ctx.req.param("parenteID");

  try {
    const parente = await parenteService.getParentesByID(parenteID);

    return ctx.json({
      message: "Parentes encontrados com sucesso",
      parente,
    });
  } catch (error: any) {
    console.error("Erro ao buscar parentes:", error);
    return ctx.json({ error: error.message }, 400);
  }
});

parenteController.use("/*", isAdminOrEmployee);
// Rota para adicionar um parente ao número de contrato
parenteController.post("/:numeroContrato", async (ctx) => {
  const numeroContrato = parseInt(ctx.req.param("numeroContrato"), 10);

  const parenteData: ParenteRequest = await ctx.req.json();

  try {
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
    return ctx.json({ error: error.message }, 400);
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

    return ctx.json({
      message: "Parente editado com sucesso",
      parenteId: parente.parenteId,
    });
  } catch (error: any) {
    console.error("Erro ao editar parente:", error);
    return ctx.json({ error: error.message }, 400);
  }
});

// Rota para deletar um parente pelo ID
parenteController.delete("/:parenteID", async (ctx) => {
  const parenteID = ctx.req.param("parenteID");

  try {
    await parenteService.deleteParenteById(parenteID);

    return ctx.json({ message: "Parente deletado com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar parente:", error);
    return ctx.json({ error: error.message }, 400);
  }
});

export default parenteController;
