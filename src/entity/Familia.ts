import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  type Relation,
} from "typeorm";
import { Parente } from "./Parente.js"; // Manter importação normal
@Entity("familia")
export class Familia {
  @PrimaryGeneratedColumn("uuid")
  familiaId!: string;

  @Column({ type: "int", unique: true })
  numeroContrato!: number;

  @Column({ type: "varchar" })
  titular!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dataCriacao!: Date;

  @OneToMany(() => Parente, (parente) => parente.familia, { nullable: true })
  parentes?: Relation<Parente[]>;

  @Column({ type: "timestamp", nullable: true, default: null })
  editadoData?: Date;

  @Column({ type: "varchar", default: "inativo" })
  statusConta?: string;

  @Column({ type: "boolean", default: false })
  excluido?: boolean;
}
