# Sistema de Gerenciamento de Famílias e Falecidos

Este sistema permite gerenciar famílias e falecidos de maneira simples e eficiente. Ele oferece funcionalidades para criar, editar e remover famílias e falecidos, além de possibilitar o envio de mensagens de recordação para os falecidos.

## Funcionalidades do Sistema

### 1. Criar uma Família

A funcionalidade de criar uma família permite ao usuário adicionar uma nova família ao sistema. Uma família possui um número de contrato único, um titular (nome do responsável) e uma lista de parentes (falecidos).

- **Rota:** `POST /familia`
- **Descrição:** Cria uma nova família com um número de contrato, titular e lista de parentes.
- **Corpo da Requisição (JSON):**

````json
{
  "numero_contrato": 12345,
  "titular": "João Silva",
  "parentes": [
    {
      "nome": "Maria Silva",
      "fotoFalecido": "url_da_foto",
      "dataNascimento": "1980-05-10",
      "dataObito": "2022-04-15"
    }
  ]
}
````
    Resposta (Sucesso):
````json
{
  "message": "Família criada com sucesso",
  "familiaId": "UUID_da_familia"
}
````
    Resposta (Erro):
````json
{
  "error": "Erro ao criar a família"
}
````

### 2. Remover ou Editar Dados de uma Família

Permite editar ou remover os dados da família, como o titular ou o número de contrato.

    Rota: PUT /familia/{familiaId}
    Descrição: Edita os dados de uma família existente.
    Corpo da Requisição (JSON):
````json
{
  "numero_contrato": 12346,
  "titular": "Carlos Oliveira"
}
````
    Resposta (Sucesso):
````json
{
  "message": "Dados da família atualizados com sucesso"
}
````
    Rota: DELETE /familia/{familiaId}
    Descrição: Remove uma família do sistema.
    Resposta (Sucesso):
````json
{
  "message": "Família removida com sucesso"
}
````

### 3. Adicionar Falecidos (Parentes) à Família

Permite adicionar novos falecidos (parentes) à família.

    Rota: POST /familia/{familiaId}/parente
    Descrição: Adiciona um novo parente (falecido) à família.
    Corpo da Requisição (JSON):
````json
{
  "nome": "Ana Costa",
  "fotoFalecido": "url_da_foto",
  "dataNascimento": "1955-07-20",
  "dataObito": "2021-11-05"
}
````
    Resposta (Sucesso):
````json
{
  "message": "Parente adicionado com sucesso",
  "parenteId": "UUID_do_parente"
}
````

    Resposta (Erro):
````json
{
  "error": "Erro ao adicionar o parente"
}
````

### 4. Remover ou Editar Dados de um Parente (Falecido)

Permite editar ou remover os dados de um parente (falecido), como nome, foto, data de nascimento e data de óbito.

    Rota: PUT /parente/{parenteId}
    Descrição: Edita os dados de um parente.
    Corpo da Requisição (JSON):
````json
{
  "nome": "Ana Costa",
  "fotoFalecido": "nova_url_da_foto",
  "dataNascimento": "1955-07-20",
  "dataObito": "2021-10-25"
}
````

    Resposta (Sucesso):
````json
{
  "message": "Dados do parente atualizados com sucesso"
}
````

    Rota: DELETE /parente/{parenteId}
    Descrição: Remove um parente da família.
    Resposta (Sucesso):
````json
{
  "message": "Parente removido com sucesso"
}
````

### 5. Atribuir uma Mensagem a um Falecido

Permite a um usuário enviar uma mensagem para um falecido da família.

    Rota: POST /parente/{parenteId}/mensagem
    Descrição: Adiciona uma mensagem a um falecido (parente).
    Corpo da Requisição (JSON):
````json
{
  "usuarioId": "UUID_do_usuario",
  "nomeUsuario": "João Silva",
  "mensagem": "Saudades eternas",
  "dataEnvio": "2024-12-05T10:00:00Z"
}
````
    Resposta (Sucesso):
````json
{
  "message": "Mensagem enviada com sucesso",
  "mensagemId": "UUID_da_mensagem"
}
````
    Resposta (Erro):
````json
{
  "error": "Erro ao enviar a mensagem"
}
````
### 6. Remover uma Mensagem de um Falecido

Permite remover uma mensagem que foi atribuída a um falecido, caso o usuário tenha permissões.

    Rota: DELETE /parente/{parenteId}/mensagem/{mensagemId}
    Descrição: Remove uma mensagem de um falecido.
    Resposta (Sucesso):
````json
{
  "message": "Mensagem removida com sucesso"
}
````
### 7. Remover ou Editar Mensagens de um Falecido (Somente Usuário Remetente)

Permite que o usuário que enviou a mensagem edite ou remova suas próprias mensagens.

    Rota: PUT /parente/{parenteId}/mensagem/{mensagemId}
    Descrição: Edita uma mensagem enviada pelo usuário.
    Corpo da Requisição (JSON):
````json
{
  "mensagem": "Nova mensagem editada"
}
````
    Resposta (Sucesso):
````json
{
  "message": "Mensagem editada com sucesso"
}
````
    Rota: DELETE /parente/{parenteId}/mensagem/{mensagemId}
    Descrição: Remove uma mensagem enviada pelo usuário.
    Resposta (Sucesso):
````json
{
  "message": "Mensagem removida com sucesso"
}
````
### 8. Buscar Família por Número de Contrato

Permite que o usuário busque informações de uma família através do número de contrato.

    Rota: GET /familia/contrato/{numeroContrato}
    Descrição: Busca uma família pelo número de contrato.
    Resposta (Sucesso):
````json
{
  "numero_contrato": 12345,
  "titular": "João Silva",
  "parentes": [
    {
      "nome": "Maria Silva",
      "fotoFalecido": "url_da_foto",
      "dataNascimento": "1980-05-10",
      "dataObito": "2022-04-15"
    }
  ]
}
````
    Resposta (Erro):
````json
{
  "error": "Família não encontrada"
}
````
### 9. Buscar Parente pelo UUID

Permite que o usuário busque um parente específico na família através do UUID, retornando as informações detalhadas, incluindo as mensagens enviadas.

    Rota: GET /parente/{parenteId}
    Descrição: Busca um parente (falecido) pelo UUID.
    Resposta (Sucesso):
````json
{
  "nome": "Maria Silva",
  "fotoFalecido": "url_da_foto",
  "dataNascimento": "1980-05-10",
  "dataObito": "2022-04-15",
  "mensagens": [
    {
      "nomeUsuario": "João Silva",
      "mensagem": "Saudades eternas",
      "dataEnvio": "2022-05-01T10:00:00Z"
    }
  ]
}
````
    Resposta (Erro):
````json
{
  "error": "Parente não encontrado"
}
````
## Considerações

### Autenticação e Autorização

    O sistema utiliza tokens de autenticação (por exemplo, JWT) para garantir que apenas usuários autorizados possam editar ou excluir dados.
    Exemplo de como autenticar:
        O usuário faz login com suas credenciais e recebe um token.
        Este token deve ser enviado no cabeçalho da requisição (Authorization: Bearer <token>).

### Validações de Dados

    As datas devem ser fornecidas no formato ISO 8601 (YYYY-MM-DD).
    Os campos obrigatórios incluem numero_contrato, titular, nome, dataNascimento, dataObito, etc.


### Estrutura do Projeto SOLID

/src
  /controllers
  /models
  /routes
  /services
  /utils

    controllers/: Controladores que gerenciam as requisições e respostas.
    models/: Modelos de dados (por exemplo, Família, Parente).
    routes/: Definições de rotas da API.
    services/: Lógica de negócios, como validações e comunicação com o banco de dados.
    utils/: Funções utilitárias (por exemplo, validação de dados).

### Considerações sobre Performance e Escalabilidade

    O sistema implementa paginação nas rotas que retornam grandes listas (por exemplo, lista de falecidos em uma família) para melhorar a performance.
    Cache pode ser usado para armazenar resultados frequentes de buscas.
````
