import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Parente } from "./Parente.ts"; // Manter importação normal

@Entity()
export class Familia {
  @PrimaryGeneratedColumn("uuid")
  familiaId!: string;

  @Column({ type: "int", unique: true })
  numeroContrato!: number;

  @Column({ type: "varchar" })
  titular!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dataCriacao!: Date;

  @OneToMany(() => Parente, (parente) => parente.familia)
  parentes?: Parente[];

  @Column({ type: "timestamp", nullable: true, default: null })
  editadoData?: Date;

  @Column({ type: "boolean", default: false })
  excluido: boolean = false;
}
