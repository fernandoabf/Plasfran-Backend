import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Familia } from "./Familia.js";

@Entity()
export class Parente {
  @PrimaryGeneratedColumn("uuid")
  parenteId!: string;

  @Column({ type: "varchar" }) // Definir tipo explícito
  nome!: string;

  @Column({ type: "varchar" }) // Definir tipo explícito
  fotoFalecido!: string;

  @Column({ type: "date" }) // Definir tipo explícito para data
  dataNascimento!: Date;

  @Column({ type: "date" }) // Definir tipo explícito para data
  dataObito!: Date;

  @ManyToOne(() => Familia, (familia) => familia.parentes)
  familia!: Familia;
}
