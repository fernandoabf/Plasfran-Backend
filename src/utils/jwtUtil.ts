import jwt from "jsonwebtoken";

// Carregar variáveis de ambiente
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string; // Valor padrão caso a variável não seja encontrada
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string; // Defina um segredo para o refresh token

// Expiração dos tokens
const JWT_EXPIRATION = process.env.JWT_EXPIRATION as string;
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION as string;

/**
 * Gera um token JWT (Access Token).
 * @param payload Dados que serão codificados no token.
 * @param expiresIn Tempo de expiração (opcional).
 * @returns Token JWT assinado.
 */
export const generateAccessToken = (
  payload: object,
  expiresIn: string = JWT_EXPIRATION
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Gera um Refresh Token.
 * @param payload Dados que serão codificados no refresh token.
 * @param expiresIn Tempo de expiração do refresh token (opcional).
 * @returns Refresh Token JWT assinado.
 */
export const generateRefreshToken = (
  payload: object,
  expiresIn: string = JWT_REFRESH_EXPIRATION
): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
};

/**
 * Verifica e decodifica um token JWT (Access Token).
 * @param token Token JWT a ser verificado.
 * @returns O payload decodificado se o token for válido.
 * @throws Erro se o token for inválido ou expirado.
 */
export const verifyAccessToken = (token: string): string | jwt.JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Token de acesso inválido ou expirado");
  }
};

/**
 * Verifica e decodifica um Refresh Token.
 * @param token Refresh Token a ser verificado.
 * @returns O payload decodificado se o token for válido.
 * @throws Erro se o token for inválido ou expirado.
 */
export const verifyRefreshToken = (token: string): string | jwt.JwtPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Refresh Token inválido ou expirado");
  }
};
