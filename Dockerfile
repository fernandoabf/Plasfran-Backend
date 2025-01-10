# Use a imagem oficial do Node.js
FROM node:22.9

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos do projeto para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código fonte do aplicativo para o contêiner
COPY . .

# Compile o código TypeScript para JavaScript
RUN npm run build

# Exponha a porta que o servidor vai usar
EXPOSE 3000

# Comando para rodar o servidor com o código compilado
CMD ["node", "dist/index.js"]
