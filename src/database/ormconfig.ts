import "reflect-metadata"; // Importante para o TypeORM
import { DataSource } from "typeorm";
import { Familia } from "../models/Familia.js";
import { Parente } from "../models/Parente.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "teste", // Atualize com o seu usuário
  password: "teste", // Atualize com a sua senha
  database: "testedatabase", // Atualize com o seu banco
  synchronize: true, // Sincroniza com o banco
  logging: true, // Loga as queries para debug
  entities: [Familia, Parente], // Certifique-se de que as entidades estão sendo registradas aqui
  migrations: [],
  subscribers: [],
});