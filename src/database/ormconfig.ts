import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./../entity/User.js";
import { Familia } from "./../entity/Familia.js";
import { Parente } from "./../entity/Parente.js";
import { Employee } from "./../entity/Employee.js";
import { Mensagem } from "./../entity/Mensagem.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [User, Familia, Parente, Employee, Mensagem],
  migrations: [],
  subscribers: [],
});
