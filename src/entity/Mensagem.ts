import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  type Relation,
} from "typeorm";
import type { Parente } from "./Parente.js";
import type { User } from "./User.js";

@Entity("mensagem")
export class Mensagem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  mensagemId!: string;

  @Column({ type: "varchar" })
  nome!: string;

  @Column({ type: "varchar", nullable: true })
  mensagem?: string;

  @Column({ type: "date" })
  sendAt!: Date;

  @ManyToOne("Parente", "mensagens", { lazy: true, nullable: true })
  parente?: Relation<Parente>;

  @Column({ type: "timestamp", nullable: true, default: null })
  editadoData?: Date;

  @Column({ type: "boolean", default: false })
  excluido?: boolean;

  @ManyToOne("User", "mensagem", { lazy: true })
  owner!: Relation<User>;
}
