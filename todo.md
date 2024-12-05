# Sistema de Gerenciamento de Famílias e Falecidos - Tarefas

## 1. Criação de Banco de Dados
- **Tarefa:** Definir e criar a estrutura de banco de dados para armazenar famílias, parentes, mensagens e contratos.
  - **Subtarefas:**
    - Criar tabela `familias` com campos: `numero_contrato`, `titular`, `data_criacao`.
    - Criar tabela `parentes` com campos: `nome`, `foto_falecido`, `data_nascimento`, `data_obito`, `familia_id`.
    - Criar tabela `mensagens` com campos: `usuario_id`, `nome_usuario`, `mensagem`, `data_envio`, `parente_id`.

## 2. Implementação das Funcionalidades do Sistema
- **Tarefa:** Implementar a funcionalidade de criação de famílias.
  - **Subtarefas:**
    - Criar a rota `POST /familia`.
    - Validar os dados recebidos no corpo da requisição.
    - Inserir os dados no banco de dados.
    - Retornar resposta de sucesso ou erro.

- **Tarefa:** Implementar a funcionalidade de edição e remoção de dados de famílias.
  - **Subtarefas:**
    - Criar a rota `PUT /familia/{familiaId}` para editar dados da família.
    - Criar a rota `DELETE /familia/{familiaId}` para remover a família.
    - Validar dados e garantir que os parâmetros sejam consistentes.

- **Tarefa:** Implementar a funcionalidade de adicionar parentes (falecidos) à família.
  - **Subtarefas:**
    - Criar a rota `POST /familia/{familiaId}/parente`.
    - Validar os dados do parente (nome, foto, datas).
    - Inserir dados no banco de dados.

- **Tarefa:** Implementar a funcionalidade de editar e remover parentes.
  - **Subtarefas:**
    - Criar a rota `PUT /parente/{parenteId}` para editar dados do parente.
    - Criar a rota `DELETE /parente/{parenteId}` para remover o parente.

- **Tarefa:** Implementar a funcionalidade de enviar mensagens para falecidos.
  - **Subtarefas:**
    - Criar a rota `POST /parente/{parenteId}/mensagem`.
    - Validar os dados da mensagem (usuário, mensagem, data).
    - Inserir a mensagem no banco de dados.

- **Tarefa:** Implementar a funcionalidade de remover mensagens de falecidos.
  - **Subtarefas:**
    - Criar a rota `DELETE /parente/{parenteId}/mensagem/{mensagemId}`.
    - Validar se o usuário tem permissão para excluir a mensagem.

- **Tarefa:** Implementar a funcionalidade de editar mensagens (somente do usuário remetente).
  - **Subtarefas:**
    - Criar a rota `PUT /parente/{parenteId}/mensagem/{mensagemId}`.
    - Permitir edição apenas de mensagens enviadas pelo usuário.

- **Tarefa:** Implementar a funcionalidade de busca por família e parente.
  - **Subtarefas:**
    - Criar a rota `GET /familia/contrato/{numeroContrato}` para buscar família pelo contrato.
    - Criar a rota `GET /parente/{parenteId}` para buscar parente pelo UUID.

## 3. Testes
- **Tarefa:** Implementar testes para cada rota.
  - **Subtarefas:**
    - Testar as rotas de criação, edição e remoção de famílias.
    - Testar as rotas de criação, edição e remoção de parentes.
    - Testar as rotas de envio, remoção e edição de mensagens.
    - Testar as buscas por família e por parente.

## 4. Documentação
- **Tarefa:** Documentar todas as rotas da API.
  - **Subtarefas:**
    - Escrever a documentação detalhada com exemplos de requisições e respostas.
    - Incluir informações sobre códigos de erro possíveis.

---

# **Status da Documentação: Concluída ✔️**

A documentação foi finalizada e está pronta para ser utilizada. Todas as rotas estão descritas de forma clara, com exemplos de requisições e respostas, além de informações sobre os códigos de erro possíveis. A documentação pode ser consultada para implementação e testes da API.
