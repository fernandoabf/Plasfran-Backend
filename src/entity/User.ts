import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Mensagem } from "./Mensagem";

@Entity("user") // Nome da tabela
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("varchar", { unique: true })
  email?: string;

  @Column("varchar", { default: "user" })
  role?: string;

  @Column("varchar", { nullable: true })
  name?: string;

  @Column("varchar", { nullable: true })
  refreshToken?: string;

  @Column("boolean", { default: false })
  excluido?: boolean;

  @Column("boolean", { nullable: true, default: false })
  bloqueado?: boolean;

  @Column({ type: "varchar", default: "inativo" })
  statusConta?: string;

  @Column("timestamptz", { default: () => "NOW()" })
  createdAt!: Date;

  @OneToMany(() => Mensagem, (mensagem) => mensagem.owner)
  mensagem?: Mensagem[];

  @Column("timestamptz", { default: () => "NOW()", onUpdate: "NOW()" })
  updatedAt!: Date;
}
