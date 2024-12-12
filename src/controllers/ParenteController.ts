import { Hono } from "hono";
import { ParenteService } from "../services/ParenteService.js";

// Instancia o controlador de rotas
const parenteController = new Hono();
const parenteService = new ParenteService();

// Define a interface para o corpo da requisição
interface ParenteRequest {
  nome: string;
  fotoFalecido?: string;
  dataNascimento: string;
  dataObito: string;
  editadoData?: string;
  excluido: boolean;
}

// Rota para buscar os parentes de uma família pelo número de contrato
parenteController.get("/contrato/:numeroContrato", async (ctx) => {
  const numeroContrato = parseInt(ctx.req.param("numeroContrato")); // Obtém o número do contrato da URL

  try {
    // Obtém os parentes da família com o número de contrato
    const parentes = await parenteService.getParentesByContrato(numeroContrato);

    // Retorna a lista de parentes
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
  const parenteID = ctx.req.param("parenteID"); // Obtém o número do contrato da URL

  try {
    // Obtém os parentes da família com o número de contrato
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

// Rota para adicionar um parente ao número de contrato
parenteController.post("/:numeroContrato", async (ctx) => {
  // Captura o parâmetro da URL (numeroContrato)
  const numeroContrato = parseInt(ctx.req.param("numeroContrato"), 10);

  // Captura os dados do corpo da requisição
  const parenteData: ParenteRequest = await ctx.req.json();

  try {
    // Chama o serviço para adicionar o parente à família com base no número do contrato
    const parente = await parenteService.addParenteToFamiliaByContrato(
      numeroContrato,
      parenteData.nome,
      parenteData.fotoFalecido,
      parenteData.dataNascimento,
      parenteData.dataObito
    );

    // Retorna a resposta com sucesso
    return ctx.json({
      message: "Parente adicionado com sucesso",
      parenteId: parente.parenteId,
    });
  } catch (error: any) {
    // Em caso de erro, loga e retorna o erro
    console.error("Erro ao adicionar parente:", error);
    return ctx.json({ error: error.message }, 400);
  }
});

// Rota para editar um parente pelo ID
parenteController.patch("/:parenteID", async (ctx) => {
  // Captura o parâmetro da URL (parenteID)
  const parenteID = ctx.req.param("parenteID");

  // Captura os dados do corpo da requisição
  const parenteData: ParenteRequest = await ctx.req.json();

  try {
    // Chama o serviço para editar o parente com base no ID
    const parente = await parenteService.editParenteById(
      parenteID,
      parenteData
    );

    // Retorna a resposta com sucesso
    return ctx.json({
      message: "Parente editado com sucesso",
      parenteId: parente.parenteId,
    });
  } catch (error: any) {
    // Em caso de erro, loga e retorna o erro
    console.error("Erro ao editar parente:", error);
    return ctx.json({ error: error.message }, 400);
  }
});

// Rota para deletar um parente pelo ID
parenteController.delete("/:parenteID", async (ctx) => {
  // Captura o parâmetro da URL (parenteID)
  const parenteID = ctx.req.param("parenteID");

  try {
    // Chama o serviço para deletar o parente com base no ID
    await parenteService.deleteParenteById(parenteID);

    // Retorna a resposta com sucesso
    return ctx.json({ message: "Parente deletado com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar parente:", error);
    return ctx.json({ error: error.message }, 400);
  }
});

// Exporta as rotas
export default parenteController;
