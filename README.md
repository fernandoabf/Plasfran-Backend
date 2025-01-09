# API Documentation

## Overview

Esta API gerencia dados relacionados a famílias, parentes, mensagens e autenticação. Abaixo estão descritos todos os endpoints disponíveis, incluindo suas funcionalidades, entradas, saídas e possíveis erros.

---

## Endpoints

### Autenticação

#### POST `/auth/login`

Realiza o login de um usuário.

**Requisição:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Resposta de sucesso (200):**

```json
{
  "accessToken": "<JWT Token>",
  "refreshToken": "<Refresh Token>"
}
```

**Possíveis erros:**

- 401: Credenciais inválidas.
- 500: Erro interno do servidor.

#### POST `/auth/google`

Realiza o login de um usuário com Google.

**Requisição:**

```json
{
  "idToken": "<Google ID Token>"
}
```

**Resposta de sucesso (200):**

```json
{
  "accessToken": "<JWT Token>",
  "refreshToken": "<Refresh Token>"
}
```

**Possíveis erros:**

- 401: Token inválido.
- 500: Erro interno do servidor.

#### POST `/auth/register`

Registra um novo funcionário (apenas administradores podem usar este endpoint).

**Requisição:**

```json
{
  "email": "employee@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "employee"
}
```

**Resposta de sucesso (201):**

```json
{
  "message": "Funcionário registrado com sucesso."
}
```

**Possíveis erros:**

- 403: Apenas administradores podem criar contas.
- 400: Dados inválidos.
- 500: Erro interno do servidor.

#### POST `/auth/refresh-token`

Atualiza tokens de autenticação.

**Requisição:**

```json
{
  "refreshToken": "<Refresh Token>"
}
```

**Resposta de sucesso (200):**

```json
{
  "accessToken": "<Novo JWT Token>",
  "refreshToken": "<Mesmo Refresh Token>"
}
```

**Possíveis erros:**

- 401: Token inválido.
- 500: Erro interno do servidor.

---

### Família

#### GET `/api/familia/:numeroContrato`

Busca uma família pelo número do contrato.

**Requisição:**
Nenhum corpo necessário.

**Resposta de sucesso (200):**

```json
{
  "message": "Família encontrada com sucesso",
  "familia": { ...dados da família... }
}
```

**Possíveis erros:**

- 400: Número de contrato inválido.
- 404: Família não encontrada.
- 500: Erro interno do servidor.

#### POST `/api/familia`

Cria uma nova família.

**Requisição:**

```json
{
  "numeroContrato": 12345,
  "titular": "John Doe",
  "statusConta": "ativo",
  "parentes": [
    {
      "nome": "Jane Doe",
      "dataNascimento": "2000-01-01",
      "dataObito": "2020-01-01",
      "mensagemObito": "Sentiremos sua falta."
    }
  ]
}
```

**Resposta de sucesso (201):**

```json
{
  "message": "Família criada com sucesso",
  "familiaId": 1
}
```

**Possíveis erros:**

- 400: Dados inválidos.
- 500: Erro interno do servidor.

#### PATCH `/api/familia/:id`

Atualiza os dados de uma família.

**Requisição:**

```json
{
  "titular": "Jane Doe"
}
```

**Resposta de sucesso (200):**

```json
{
  "message": "Família atualizada com sucesso",
  "familia": { ...dados atualizados... }
}
```

**Possíveis erros:**

- 400: Dados inválidos.
- 404: Família não encontrada.
- 500: Erro interno do servidor.

#### DELETE `/api/familia/:numeroContrato`

Remove uma família pelo número do contrato.

**Resposta de sucesso (200):**

```json
{
  "message": "Família removida com sucesso"
}
```

**Possíveis erros:**

- 400: Número de contrato inválido.
- 404: Família não encontrada.
- 500: Erro interno do servidor.

---

### Parentes

#### GET `/api/parente/contrato/:numeroContrato`

Busca parentes associados a uma família pelo número de contrato.

**Requisição:**
Nenhum corpo necessário.

**Resposta de sucesso (200):**

```json
{
  "message": "Parentes encontrados com sucesso",
  "parentes": [ ...dados dos parentes... ]
}
```

**Possíveis erros:**

- 400: Número de contrato inválido.
- 500: Erro interno do servidor.

#### GET `/api/parente/:parenteID`

Busca um parente pelo ID.

**Requisição:**
Nenhum corpo necessário.

**Resposta de sucesso (200):**

```json
{
  "message": "Parente encontrado com sucesso",
  "parente": { ...dados do parente... }
}
```

**Possíveis erros:**

- 404: Parente não encontrado.
- 500: Erro interno do servidor.

#### POST `/api/parente/:numeroContrato`

Adiciona um parente a uma família pelo número de contrato.

**Requisição:**

```json
{
  "nome": "John Doe",
  "dataNascimento": "1980-01-01",
  "dataObito": "2020-01-01",
  "mensagemObito": "Sempre será lembrado.",
  "statusConta": "ativo",
  "privada": false,
  "whitelist": ["user1@example.com", "user2@example.com"]
}
```

**Resposta de sucesso (201):**

```json
{
  "message": "Parente adicionado com sucesso",
  "parenteId": 1
}
```

**Possíveis erros:**

- 400: Dados inválidos.
- 500: Erro interno do servidor.

#### PATCH `/api/parente/:parenteID`

Atualiza os dados de um parente pelo ID.

**Requisição:**

```json
{
  "nome": "Jane Doe"
}
```

**Resposta de sucesso (200):**

```json
{
  "message": "Parente editado com sucesso",
  "parenteId": 1
}
```

**Possíveis erros:**

- 400: Dados inválidos.
- 404: Parente não encontrado.
- 500: Erro interno do servidor.

#### DELETE `/api/parente/:parenteID`

Remove um parente pelo ID.

**Resposta de sucesso (200):**

```json
{
  "message": "Parente deletado com sucesso"
}
```

**Possíveis erros:**

- 404: Parente não encontrado.
- 500: Erro interno do servidor.

---

### Mensagens

#### GET `/api/mensagem/:parenteId`

Busca mensagens associadas a um parente pelo ID.

**Requisição:**
Nenhum corpo necessário.

**Resposta de sucesso (200):**

```json
{
  "message": "Mensagens encontradas com sucesso",
  "mensagens": [ ...dados das mensagens... ]
}
```

**Possíveis erros:**

- 404: Nenhuma mensagem encontrada.
- 500: Erro interno do servidor.

#### POST `/api/mensagem/:parenteId`

Adiciona uma mensagem a um parente pelo ID.

**Requisição:**

```json
{
  "nome": "John Doe",
  "mensagem": "Sentiremos sua falta."
}
```

**Resposta de sucesso (201):**

```json
{
  "message": "Mensagem adicionada com sucesso",
  "mensagemId": 1
}
```

**Possíveis erros:**

- 400: Dados inválidos.
- 500: Erro interno do servidor.

#### PATCH `/api/mensagem/:mensagemId`

Atualiza o conteúdo de uma mensagem pelo ID.

**Requisição:**

```json
{
  "mensagem": "Nova mensagem de homenagem."
}
```

**Resposta de sucesso (200):**

```json
{
  "message": "Mensagem editada com sucesso",
  "mensagemId": 1,
  "mensagemEditada": "Nova mensagem de homenagem."
}
```

**Possíveis erros:**

- 400: Dados inválidos.
- 404: Mensagem não encontrada.
- 500: Erro interno do servidor.

#### DELETE `/api/mensagem/:mensagemId`

Remove uma mensagem pelo ID.

**Resposta de sucesso (200):**

```json
{
  "message": "Mensagem deletada com sucesso"
}
```

**Possíveis erros:**

- 404: Mensagem não encontrada.
- 500: Erro interno do servidor.

---

## Observações

- Todas as rotas protegidas exigem autenticação com um token JWT válido.
