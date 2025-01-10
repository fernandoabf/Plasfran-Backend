import { Familia } from "../entity/Familia.js";
import { Parente } from "../entity/Parente.js";
import { AppDataSource } from "../database/ormconfig.js";

export class ParenteService {
  private familiaRepository = AppDataSource.getRepository(Familia);
  private parenteRepository = AppDataSource.getRepository(Parente);

  async addParenteToFamiliaByContrato(
    numeroContrato: number,
    nome: string,
    fotoFalecido: string,
    dataNascimento: string,
    dataObito: string,
    mensagemObito: string,
    statusConta: string,
    privada: boolean,
    whitelist: string[]
  ): Promise<Parente> {
    const familia = await this.familiaRepository.findOneBy({ numeroContrato });

    if (!familia) {
      throw new Error("Família com o número de contrato não encontrada");
    }

    const parente = this.parenteRepository.create({
      nome,
      fotoFalecido,
      dataNascimento: new Date(dataNascimento),
      dataObito: new Date(dataObito),
      familia,
      mensagemObito,
      statusConta,
      privada,
      whitelist,
    });

    return this.parenteRepository.save(parente);
  }

  async getParentesByContrato(numeroContrato: number): Promise<Parente[]> {
    // Busca a família pelo número do contrato
    const familia = await this.familiaRepository.findOne({
      where: { numeroContrato, excluido: false },
      relations: ["parentes"],
    });

    if (!familia) {
      throw new Error("Família com o número de contrato não encontrada");
    }

    return familia.parentes?.filter((parente) => !parente.excluido) || [];
  }

  async getParentesByID(parenteId: string): Promise<Parente> {
    const parente = await this.parenteRepository.findOne({
      where: { parenteId, excluido: false },
      relations: ["familia"], // Inclui a família na consulta
    });

    if (!parente) {
      throw new Error("Parente com o ID fornecido não encontrado");
    }

    return parente;
  }

  async editParenteById(
    parenteId: string,
    data: {
      nome?: string;
      fotoFalecido?: string;
      dataNascimento?: string;
      dataObito?: string;
      mensagemObito?: string;
      statusConta?: string;
      privada?: boolean;
      whitelist?: string[];
    }
  ): Promise<Parente> {
    const parente = await this.parenteRepository.findOne({
      where: { parenteId, excluido: false },
    });

    if (!parente) {
      throw new Error("Parente com o ID fornecido não encontrado");
    }

    if (data.nome !== undefined && data.nome !== null) {
      parente.nome = data.nome;
    }

    if (data.fotoFalecido !== undefined && data.fotoFalecido !== null) {
      parente.fotoFalecido = data.fotoFalecido;
    }

    if (data.statusConta !== undefined && data.statusConta !== null) {
      parente.statusConta = data.statusConta;
    }

    if (data.privada !== undefined && data.privada !== null) {
      parente.privada = data.privada;
    }

    if (data.whitelist !== undefined && data.whitelist !== null) {
      parente.whitelist = data.whitelist;
    }

    if (data.dataNascimento !== undefined && data.dataNascimento !== null) {
      parente.dataNascimento = new Date(data.dataNascimento);
    }

    if (data.dataObito !== undefined && data.dataObito !== null) {
      parente.dataObito = new Date(data.dataObito);
    }

    if (data.mensagemObito !== undefined && data.mensagemObito !== null) {
      parente.mensagemObito = data.mensagemObito;
    }

    // Adicionando a data de edição
    parente.editadoData = new Date();

    // Salvando o parente atualizado
    return this.parenteRepository.save(parente);
  }

  async deleteParenteById(parenteId: string): Promise<Parente> {
    const parente = await this.parenteRepository.findOne({
      where: { parenteId, excluido: false }, // Busca o parente pelo ID
    });

    if (!parente) {
      throw new Error("Parente com o ID fornecido não encontrado");
    }

    parente.excluido = true;

    return this.parenteRepository.save(parente);
  }
}
