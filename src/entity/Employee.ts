import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("employee") // Nome da tabela
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column("varchar", { unique: true })
  email?: string;

  @Column("varchar")
  password?: string;

  @Column("varchar", { default: "user" })
  role?: string;

  @Column("varchar", { nullable: true })
  name?: string;

  @Column("varchar", { nullable: true })
  refreshToken?: string;

  @Column({ type: "varchar", default: "inativo" })
  statusConta?: string;

  @Column({ type: "boolean", default: false })
  excluido?: boolean;

  @Column("timestamptz", { default: () => "NOW()" })
  createdAt!: Date;

  @Column("timestamptz", { default: () => "NOW()", onUpdate: "NOW()" })
  updatedAt!: Date;
}
