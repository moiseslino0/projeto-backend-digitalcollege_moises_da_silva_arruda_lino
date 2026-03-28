# Projeto Backend Digital College
**Desenvolvido por:** Moisés da Silva Arruda Lino e Gabriela Oliveira de Sousa

Este é o projeto final do módulo de Back-end, implementado integralmente conforme o escopo oficial do repositório de avaliação. A API conta com autenticação por Tokens e fornece os endpoints de CRUD para Usuários, Categorias e Produtos.

## Tecnologias Utilizadas
- **Node.js** com **Express**
- **Sequelize ORM** e banco de dados **MySQL**
- **JSON Web Token (JWT)** e **Bcrypt** para autenticação e rotas privadas
- Dotenv para configurações

## Como testar e rodar o projeto localmente

1. Abra o terminal e instale as bibliotecas executando:
   `npm install`

2. Certifique-se de que seu MySQL/XAMPP está ligado. Renomeie o arquivo `.env.example` para `.env` (ou edite caso seu banco tenha senha):
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASS=
   DB_NAME=projeto_backend_digitalcollege
   ```

3. Crie e migre as tabelas do projeto rodando os comandos do Sequelize:
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

4. Inicie o servidor localmente:
   ```bash
   npm run dev
   ```

A API estará respondendo em `http://localhost:3000/v1`.
