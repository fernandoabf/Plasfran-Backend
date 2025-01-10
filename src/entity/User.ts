import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  type Relation,
} from "typeorm";
import type { Mensagem } from "./Mensagem.js";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("varchar", { unique: true })
  email!: string;

  @Column("varchar", { nullable: true })
  name?: string;

  @Column("varchar", { nullable: true })
  refreshToken?: string;

  @Column("boolean", { default: false })
  excluido?: boolean;

  @Column("boolean", { default: false })
  bloqueado?: boolean;

  @Column("varchar", { default: "inativo" })
  statusConta?: string;

  @Column("timestamptz", { default: () => "NOW()" })
  createdAt!: Date;

  @Column("varchar", { default: "user" })
  role?: string;

  @OneToMany("Mensagem", "owner", { lazy: true, nullable: true })
  mensagem!: Relation<Mensagem[]>;

  @Column("timestamptz", { default: () => "NOW()", onUpdate: "NOW()" })
  updatedAt!: Date;
}
