import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("users") // Nome da tabela
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("varchar", { unique: true })
  email?: string;

  @Column("varchar", { nullable: true })
  password?: string;

  @Column("varchar", { default: "user" })
  role?: string;

  @Column("varchar", { nullable: true })
  name?: string;

  @Column("varchar", { nullable: true })
  refreshToken?: string;

  @Column("timestamptz", { default: () => "NOW()" })
  createdAt!: Date;

  @Column("timestamptz", { default: () => "NOW()", onUpdate: "NOW()" })
  updatedAt!: Date;
}
