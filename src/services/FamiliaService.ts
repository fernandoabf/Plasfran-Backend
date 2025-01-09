import { Familia } from "../entity/Familia.ts";
import { Parente } from "../entity/Parente.ts";
import { AppDataSource } from "../database/ormconfig.js";

export class FamiliaService {
  private familiaRepository = AppDataSource.getRepository(Familia);
  private parenteRepository = AppDataSource.getRepository(Parente);

  async createFamiliaWithOptionalParentes(
    numeroContrato: number,
    titular: string,
    statusConta: string,
    parentesData?: {
      nome: string;
      fotoFalecido?: string;
      dataNascimento: string;
      dataObito: string;
      mensagemObito: string;
    }[]
  ): Promise<Familia> {
    return AppDataSource.transaction(async (transactionManager) => {
      const familia = this.familiaRepository.create({
        numeroContrato,
        titular,
      });
      const savedFamilia = await transactionManager.save(familia);

      if (parentesData && parentesData.length > 0) {
        const parentes = parentesData.map((parenteData) =>
          this.parenteRepository.create({
            nome: parenteData.nome,
            fotoFalecido: parenteData.fotoFalecido,
            dataNascimento: new Date(parenteData.dataNascimento),
            dataObito: new Date(parenteData.dataObito),
            mensagemObito: parenteData.mensagemObito,
            familia: savedFamilia,
            statusConta,
          })
        );

        await transactionManager.save(Parente, parentes);
      }

      return savedFamilia;
    });
  }

  async getFamiliaByContrato(numeroContrato: number): Promise<Familia | null> {
    return this.familiaRepository.findOne({
      where: { numeroContrato, excluido: false },
      relations: ["parentes"],
    });
  }

  async editFamiliaById(
    familiaId: string,
    data: { numeroContrato?: number; titular?: string }
  ): Promise<Familia | null> {
    const familia = await this.familiaRepository.findOne({
      where: { familiaId, excluido: false },
      relations: ["parentes"],
    });

    if (!familia) {
      return null;
    }

    if (data.numeroContrato !== undefined && data.numeroContrato !== null) {
      familia.numeroContrato = data.numeroContrato;
    }
    if (data.titular !== undefined && data.titular !== null) {
      familia.titular = data.titular;
    }

    familia.editadoData = new Date();
    await this.familiaRepository.save(familia);

    return familia;
  }

  async removeFamiliaByContrato(
    numeroContrato: number
  ): Promise<Familia | null> {
    const familia = await this.familiaRepository.findOne({
      where: { numeroContrato, excluido: false },
      relations: ["parentes"],
    });

    if (!familia) {
      return null;
    }

    familia.excluido = true;
    familia.editadoData = new Date();

    await this.familiaRepository.save(familia);

    return familia;
  }
}
