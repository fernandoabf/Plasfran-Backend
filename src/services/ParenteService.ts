import { Familia } from "../entity/Familia.ts";
import { Parente } from "../entity/Parente.ts";
import { AppDataSource } from "../database/ormconfig.js";

export class ParenteService {
  private familiaRepository = AppDataSource.getRepository(Familia);
  private parenteRepository = AppDataSource.getRepository(Parente);

  async addParenteToFamiliaByContrato(
    numeroContrato: number,
    nome: string,
    fotoFalecido: string | undefined,
    dataNascimento: string,
    dataObito: string
  ): Promise<Parente> {
    const familia = await this.familiaRepository.findOneBy({ numeroContrato });

    if (!familia) {
      throw new Error("Família com o número de contrato não encontrada");
    }

    // Cria o parente com os dados passados
    const parente = this.parenteRepository.create({
      nome,
      fotoFalecido,
      dataNascimento: new Date(dataNascimento),
      dataObito: new Date(dataObito),
      familia,
    });

    // Salva o parente no banco de dados e retorna
    return this.parenteRepository.save(parente);
  }

  async getParentesByContrato(numeroContrato: number): Promise<Parente[]> {
    // Busca a família pelo número do contrato
    const familia = await this.familiaRepository.findOne({
      where: { numeroContrato, excluido: false }, // Busca a família com o número do contrato
      relations: ["parentes"], // Inclui os parentes na consulta
    });

    // Se a família não for encontrada, lança um erro
    if (!familia) {
      throw new Error("Família com o número de contrato não encontrada");
    }

    // Retorna todos os parentes associados a essa família
    return familia.parentes || [];
  }

  async getParentesByID(parenteId: string): Promise<Parente> {
    // Busca o parente pelo ID
    const parente = await this.parenteRepository.findOne({
      where: { parenteId, excluido: false }, // Busca o parente pelo ID
      relations: ["familia"], // Inclui a família na consulta
    });

    // Se o parente não for encontrado, lança um erro
    if (!parente) {
      throw new Error("Parente com o ID fornecido não encontrado");
    }

    // Retorna o parente encontrado
    return parente;
  }
}
