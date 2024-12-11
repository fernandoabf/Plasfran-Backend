import { Familia } from "../models/Familia.js";
import { Parente } from "../models/Parente.js";
import { AppDataSource } from "../database/ormconfig.js";

export class FamiliaService {
  private familiaRepository = AppDataSource.getRepository(Familia);
  private parenteRepository = AppDataSource.getRepository(Parente);

  async createFamiliaWithOptionalParentes(
    numeroContrato: number,
    titular: string,
    parentesData:
      | {
          nome: string;
          fotoFalecido?: string;
          dataNascimento: string;
          dataObito: string;
        }[]
      | undefined
  ): Promise<Familia> {
    const familia = this.familiaRepository.create({
      numeroContrato,
      titular,
    });

    const savedFamilia = await this.familiaRepository.save(familia);

    if (parentesData && parentesData.length > 0) {
      for (const parenteData of parentesData) {
        const parente = this.parenteRepository.create({
          nome: parenteData.nome,
          fotoFalecido: parenteData.fotoFalecido,
          dataNascimento: new Date(parenteData.dataNascimento),
          dataObito: new Date(parenteData.dataObito),
          familia: savedFamilia,
        });
        await this.parenteRepository.save(parente);
      }
    }

    return savedFamilia;
  }

  async getFamiliaByContrato(numeroContrato: number): Promise<Familia | null> {
    return this.familiaRepository.findOne({
      where: { numeroContrato },
      relations: ["parentes"],
    });
  }
}
