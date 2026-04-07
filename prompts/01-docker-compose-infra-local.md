Este repositório conecta em um banco PostgreSQL remoto (Neon) via DATABASE_URL no .env.
Quero rodar localmente com Docker. Crie:
1. Um docker-compose.yml com PostgreSQL 15 (user: chinook, password: chinook, db: chinook)
2. Um .env.local com DATABASE_URL apontando pro container local
3. Troque o driver do banco de @neondatabase/serverless (que só funciona com Neon) para postgres (postgres.js) + drizzle-orm/postgres-js, que funciona com qualquer PostgreSQL
4. Adicione scripts "infra:start" e "infra:stop" no package.json raiz

Teste subindo o container e verificando a conexão.
