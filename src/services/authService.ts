import { AppDataSource } from "../database/ormconfig.js";
import { User } from "../entity/User.js";
import { Employee } from "../entity/Employee.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtil.js"; // Importando os métodos de geração dos tokens
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Função para login padrão com email e senha.
 */
export const loginUser = async (email: string, password: string) => {
  const userRepository = AppDataSource.getRepository(Employee);

  try {
    // Verificar se o usuário existe no banco de dados
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    // Verificar se a senha está correta (com bcrypt ou outro método de hash se necessário)
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: "Senha incorreta" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Senha incorreta" };
    }

    // Gerar o Access Token e o Refresh Token
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Armazenar o Refresh Token no banco de dados
    user.refreshToken = refreshToken;
    await userRepository.save(user);

    return { success: true, accessToken, refreshToken };
  } catch (error) {
    console.error("Erro no login do usuário:", error);
    return { success: false, message: "Erro no login" };
  }
};

export const registerEmployee = async (
  email: string,
  password: string,
  name: string,
  role: string = "employee"
) => {
  const employeeRepository = AppDataSource.getRepository(Employee);

  try {
    // Verificar se o e-mail já está em uso
    const existingEmployee = await employeeRepository.findOne({
      where: { email },
    });

    if (existingEmployee) {
      return { success: false, message: "E-mail já cadastrado" };
    }

    // Hash da senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar e salvar o novo Employee
    const newEmployee = employeeRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    await employeeRepository.save(newEmployee);

    return { success: true, message: "Funcionário registrado com sucesso" };
  } catch (error) {
    console.error("Erro ao registrar funcionário:", error);
    return { success: false, message: "Erro ao registrar funcionário" };
  }
};
/**
 * Função para login com Google usando o ID Token.
 */
export const loginWithGoogle = async (idToken: string) => {
  try {
    // Verificar o token do Google com o ID Token recebido
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Confirme que este valor é seu client ID do Google
    });

    // Obter os dados do payload do token
    const payload = ticket.getPayload();

    if (!payload) {
      return {
        success: false,
        message: "Token inválido ou usuário não autenticado pelo Google",
      };
    }

    const { email, name } = payload;

    // Verificar se o usuário já existe no banco de dados
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({ where: { email } });

    // Se o usuário não existir, criar um novo usuário
    if (!user) {
      user = userRepository.create({
        email,
        name,
        role: "user",
      });
      await userRepository.save(user);
    }

    // Gerar o Access Token e o Refresh Token
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Armazenar o Refresh Token no banco de dados
    user.refreshToken = refreshToken;
    await userRepository.save(user);

    return { success: true, accessToken, refreshToken };
  } catch (error) {
    console.error("Erro no login com Google:", error);
    return { success: false, message: "Erro na autenticação com Google" };
  }
};

/**
 * Função para renovar o Access Token usando o Refresh Token.
 */
export const refreshTokens = async (refreshToken: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const employeeRepository = AppDataSource.getRepository(Employee);

  try {
    // Verificar se o Refresh Token é válido
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ); // Decodifique o Refresh Token

    // Buscar o usuário usando o id decodificado
    const user = await userRepository.findOne({
      where: { id: (decoded as jwt.JwtPayload).id },
    });

    const employee = await employeeRepository.findOne({
      where: { id: (decoded as jwt.JwtPayload).id },
    });

    if (
      (!user || user.refreshToken !== refreshToken) &&
      (!employee || employee.refreshToken !== refreshToken)
    ) {
      return {
        success: false,
        message: "Refresh Token inválido ou não encontrado",
      };
    }

    // Gerar um novo Access Token
    const newAccessToken = generateAccessToken({
      id: user ? user.id : employee!.id,
      email: user ? user.email : employee!.email,
      role: user ? user.role : employee!.role,
    });

    // Não gerar um novo Refresh Token, apenas retornar o mesmo
    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: refreshToken, // Manter o Refresh Token atual
    };
  } catch (error) {
    console.error("Erro ao renovar os tokens:", error);
    return { success: false, message: "Erro ao renovar os tokens" };
  }
};
