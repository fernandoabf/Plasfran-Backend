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
  async getMensagensByParenteId(parenteId: string): Promise<Mensagem[]> {
    const parente = await this.parenteRepository.findOne({
      where: { parenteId, excluido: false },
      relations: ["mensagens"],
    });

    if (!parente) {
      throw new Error("Parente com o ID fornecido não encontrado");
    }
    return parente.mensagens?.filter((mensagem) => !mensagem.excluido) ?? [];
  }

  async deleteMensagemById(mensagemId: string): Promise<Mensagem> {
    const mensagem = await this.mensagemRepository.findOne({
      where: { mensagemId, excluido: false },
    });

    if (!mensagem) {
      throw new Error("Mensagem com o ID fornecido não encontrada");
    }

    mensagem.excluido = true;

    return this.mensagemRepository.save(mensagem);
  }

  async editMensagemById(
    mensagemId: string,
    mensagemEdited: string
  ): Promise<Mensagem> {
    const mensagem = await this.mensagemRepository.findOne({
      where: { mensagemId, excluido: false },
    });

    if (!mensagem) {
      throw new Error("Mensagem com o ID fornecido não encontrada");
    }

    mensagem.mensagem = mensagemEdited;

    mensagem.editadoData = new Date();

    return this.mensagemRepository.save(mensagem);
  }
}
