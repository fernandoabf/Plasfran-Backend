import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  type Relation,
} from "typeorm";
import { Parente } from "./Parente.js";
import { User } from "./User.js";

@Entity("mensagem")
export class Mensagem {
  @PrimaryGeneratedColumn("uuid")
  mensagemId!: string;

  @Column({ type: "varchar" })
  nome!: string;

  @Column({ type: "varchar", nullable: true })
  mensagem?: string;

  @Column({ type: "date" })
  sendAt!: Date;

  // Relação ManyToOne correta
  @ManyToOne(() => Parente, (parente) => parente.mensagens)
  parente!: Relation<Parente>;

  @Column({ type: "timestamp", nullable: true, default: null })
  editadoData?: Date;

  @Column({ type: "boolean", default: false })
  excluido?: boolean;

  @ManyToOne(() => User, { lazy: true })
  owner!: Relation<User>;
}
