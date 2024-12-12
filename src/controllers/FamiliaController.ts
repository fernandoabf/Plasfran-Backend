import { Hono } from "hono";
import { FamiliaService } from "../services/FamiliaService.js";
import { QueryFailedError } from "typeorm";

const familiaController = new Hono();
const familiaService = new FamiliaService();

interface FamiliaRequest {
  numeroContrato: number;
  titular: string;
  editadoData?: string;
  excluido: boolean;
  parentes?: {
    nome: string;
    fotoFalecido?: string;
    dataNascimento: string;
    dataObito: string;
    editadoData?: string;
    excluido: boolean;
  }[];
}

// Buscar uma família pelo número do contrato
familiaController.get("/:numeroContrato", async (ctx) => {
  try {
    const numeroContrato = parseInt(ctx.req.param("numeroContrato"));
    if (isNaN(numeroContrato)) {
      return ctx.json({ error: "Número de contrato inválido" }, 400);
    }

    const familia = await familiaService.getFamiliaByContrato(numeroContrato);

    if (!familia) {
      return ctx.json({ error: "Família não encontrada" }, 404);
    }

    return ctx.json({ message: "Família encontrada com sucesso", familia });
  } catch (error: any) {
    console.error(error);
    return ctx.json({ error: error.message }, 500);
  }
});

// Criar uma nova família
familiaController.post("/", async (ctx) => {
  try {
    const familiaData: FamiliaRequest = await ctx.req.json();

    if (
      !familiaData.numeroContrato ||
      typeof familiaData.numeroContrato !== "number"
    ) {
      return ctx.json(
        { error: "Dados inválidos: número de contrato ausente ou inválido" },
        400
      );
    }

    if (!familiaData.titular || typeof familiaData.titular !== "string") {
      return ctx.json(
        { error: "Dados inválidos: Nome do titular ausente ou inválido" },
        400
      );
    }

    if (familiaData.parentes) {
      for (const parente of familiaData.parentes) {
        if (!parente.nome || typeof parente.nome !== "string") {
          return ctx.json(
            { error: "Dados inválidos: Nome do parente ausente ou inválido" },
            400
          );
        }
        if (
          parente.dataNascimento &&
          isNaN(Date.parse(parente.dataNascimento))
        ) {
          return ctx.json(
            { error: "Dados inválidos: Data de nascimento inválida" },
            400
          );
        }
        if (parente.dataObito && isNaN(Date.parse(parente.dataObito))) {
          return ctx.json(
            { error: "Dados inválidos: Data de óbito inválida" },
            400
          );
        }
      }
    }

    const familia = await familiaService.createFamiliaWithOptionalParentes(
      familiaData.numeroContrato,
      familiaData.titular,
      familiaData.parentes
    );

    return ctx.json({
      message: "Família criada com sucesso",
      familiaId: familia.familiaId,
    });
  } catch (error: any) {
    console.error(error);
    return ctx.json({ error: error.message }, 500);
  }
});

// Atualizar dados de uma família
familiaController.patch("/:id", async (ctx) => {
  try {
    const familiaId = ctx.req.param("familiaId") as string;

    const familyDataForEdit: Partial<{ contrato: number; titular: string }> =
      await ctx.req.json();

    const familia = await familiaService.editFamiliaByContrato(
      familiaId,
      familyDataForEdit
    );

    if (!familia) {
      return ctx.json({ error: "Família não encontrada" }, 404);
    }

    return ctx.json({ message: "Família atualizada com sucesso", familia });
  } catch (error: any) {
    console.error(error);
    return ctx.json({ error: error.message }, 500);
  }
});

export default familiaController;
