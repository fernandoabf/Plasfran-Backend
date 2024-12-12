import { AppDataSource } from "../database/ormconfig.ts";
import { Mensagem } from "../entity/Mensagem.ts";
import { Parente } from "../entity/Parente.ts";

export class MensagemService {
  private parenteRepository = AppDataSource.getRepository(Parente);
  private mensagemRepository = AppDataSource.getRepository(Mensagem);

  async addMensagemToParente(
    parenteId: string,
    nome: string,
    mensagem: string
  ): Promise<Mensagem> {
    const parente = await this.parenteRepository.findOne({
      where: { parenteId, excluido: false },
    });

    if (!parente) {
      throw new Error("Parente com o ID fornecido não encontrado");
    }

    const mensagemEntity = this.mensagemRepository.create({
      nome,
      mensagem,
      sendAt: new Date(),
      parente,
    });

    return this.mensagemRepository.save(mensagemEntity);
  }
  async getMensagesByParenteId(parenteId: string): Promise<Mensagem[]> {
    const parente = await this.parenteRepository.findOne({
      where: { parenteId, excluido: false },
      relations: ["mensagens"],
    });

    if (!parente) {
      throw new Error("Parente com o ID fornecido não encontrado");
    }

    return parente.mensagens || [];
  }
}
