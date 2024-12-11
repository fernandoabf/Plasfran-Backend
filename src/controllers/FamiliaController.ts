import { Hono } from "hono";
import { FamiliaService } from "../services/FamiliaService.js";

const familiaController = new Hono();
const familiaService = new FamiliaService();

// Define um tipo para a estrutura de dados da família
interface FamiliaRequest {
  numeroContrato: number;
  titular: string;
  parentes?: {
    nome: string;
    fotoFalecido?: string;
    dataNascimento: string;
    dataObito: string;
  }[]; // Parentes agora é opcional
}

// Rota para criar uma família
familiaController.post("/", async (ctx) => {
  try {
    // Validação dos dados recebidos
    const familiaData: FamiliaRequest = await ctx.req.json();

    if (!familiaData.numeroContrato || !familiaData.titular) {
      return ctx.json(
        { error: "Dados incompletos: número de contrato ou titular ausentes" },
        400
      );
    }

    // Chama o serviço para criar a família com parentes (caso existam)
    const familia = await familiaService.createFamiliaWithOptionalParentes(
      familiaData.numeroContrato,
      familiaData.titular,
      familiaData.parentes
    );

    // Retorna a resposta com sucesso
    return ctx.json({
      message: "Família criada com sucesso",
      familiaId: familia.familiaId,
    });
  } catch (error) {
    console.error("Erro ao criar família:", error);

    // Responde com um erro 400 em caso de falha
    return ctx.json({ error: "Erro ao criar a família" }, 400);
  }
});

// Rota para buscar a família pelo número do contrato
familiaController.get("/:numeroContrato", async (ctx) => {
  const numeroContrato = parseInt(ctx.req.param("numeroContrato"));

  try {
    // Chama o serviço para buscar a família pelo número do contrato
    const familia = await familiaService.getFamiliaByContrato(numeroContrato);

    if (!familia) {
      return ctx.json({ error: "Família não encontrada" }, 404);
    }

    return ctx.json({
      message: "Família encontrada com sucesso",
      familia,
    });
  } catch (error) {
    console.error("Erro ao buscar família:", error);
    return ctx.json({ error: "Erro ao buscar família" }, 400);
  }
});

export default familiaController;
