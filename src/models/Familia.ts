import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Parente } from "./Parente.js";

@Entity()
export class Familia {
  @PrimaryGeneratedColumn("uuid")
  familiaId!: string;

  @Column({ type: "int", unique: true }) // Definindo o tipo explicitamente como int
  numeroContrato!: number;

  @Column({ type: "varchar" }) // Definindo o tipo explicitamente para o titular
  titular!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dataCriacao!: Date;

  @OneToMany(() => Parente, (parente) => parente.familia)
  parentes!: Parente[];
}
