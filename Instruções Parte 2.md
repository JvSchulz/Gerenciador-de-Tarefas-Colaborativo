## Banco de dados

- Preencha `backend/.env` com a conexão MongoDB em `MONGO_URI`.
- As collections são criadas automaticamente pelo Mongoose a partir dos modelos em `backend/NoRelational/models/*.js`.
- O usuário padrão é criado automaticamente na inicialização do CLI em `backend/NoRelational/services/initService.js`.
- Após rodar a aplicação pela primeira vez execute `node scripts/seedExample.js

## Execução

- Acesse a pasta do backend: `cd backend`
- Instale dependências: `npm install`
- Execute o CLI: `node cli.js`
- A aplicação conecta ao MongoDB, garante o usuário padrão e abre o menu principal no terminal.
