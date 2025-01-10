import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import { Familia } from "./Familia.js";
import { Mensagem } from "./Mensagem.js";

@Entity("parente")
export class Parente {
  @PrimaryGeneratedColumn("uuid")
  parenteId!: string;

  @Column({ type: "varchar" })
  nome!: string;

  @Column({ type: "varchar" })
  fotoFalecido!: string;

  @Column({ type: "date" })
  dataNascimento!: Date;

  @Column({ type: "date" })
  dataObito!: Date;

  @Column({ type: "varchar" })
  mensagemObito!: string;

  // Relação OneToMany correta
  @OneToMany(() => Mensagem, (mensagem) => mensagem.parente)
  mensagens!: Relation<Mensagem[]>;

  @ManyToOne(() => Familia, (familia) => familia.parentes, {
    lazy: true,
  })
  familia!: Relation<Familia>;

  @Column({ type: "timestamp", nullable: true, default: null })
  editadoData?: Date;

  @Column({ type: "boolean", default: false })
  excluido?: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dataCriacao!: Date;

  @Column({ type: "varchar", default: "inativo" })
  statusConta?: string;

  @Column({ type: "boolean", default: false })
  privada?: boolean;

  @Column({ type: "varchar", array: true, nullable: true })
  whitelist?: string[] = [];
}
