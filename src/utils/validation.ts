export const validateFamilia = (numeroContrato: number, titular: string) => {
  if (!numeroContrato || !titular) {
    throw new Error("O número do contrato e o titular são obrigatórios");
  }
};

export const validateParente = (
  nome: string,
  fotoFalecido: string,
  dataNascimento: string,
  dataObito: string
) => {
  if (!nome || !fotoFalecido || !dataNascimento || !dataObito) {
    throw new Error("Todos os campos são obrigatórios");
  }
};

export const validateMensagem = (
  usuarioId: string,
  nomeUsuario: string,
  mensagem: string
) => {
  if (!usuarioId || !nomeUsuario || !mensagem) {
    throw new Error("Os campos usuário e mensagem são obrigatórios");
  }
};
