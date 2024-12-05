// src/services/authService.ts
import axios from "axios";

export class AuthService {
  // Método para verificar o idToken usando axios e a API do Google
  async verifyIdToken(idToken: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
      );

      if (response.data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar o idToken:", error);
      return false;
    }
  }
}
