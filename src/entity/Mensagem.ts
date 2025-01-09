import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Parente } from "./Parente.ts";
import { User } from "./User.ts"; // Importe o modelo de usuário

@Entity()
export class Mensagem {
  @PrimaryGeneratedColumn("uuid")
  mensagemId!: string;

  @Column({ type: "varchar" })
  nome!: string;

  @Column({ type: "varchar", nullable: true })
  mensagem?: string;

  @Column({ type: "date" })
  sendAt!: Date;

  @ManyToOne(() => Parente, (parente) => parente.mensagens)
  parente!: Parente;

  @Column({ type: "timestamp", nullable: true, default: null })
  editadoData?: Date;

  @Column({ type: "boolean", default: false })
  excluido?: boolean;

  @ManyToOne(() => User, (user) => user.mensagem)
  owner?: User;
}
