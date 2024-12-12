import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Familia } from "./Familia.ts";
import { Mensagem } from "./Mensagem.ts";

@Entity()
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

  @OneToMany(() => Mensagem, (mensagem) => mensagem.parente)
  mensagens?: Mensagem[];

  @ManyToOne(() => Familia, (familia) => familia.parentes)
  familia!: Familia;

  @Column({ type: "timestamp", nullable: true, default: null })
  editadoData?: Date;

  @Column({ type: "boolean", default: false })
  excluido: boolean = false;
}
