# Chinook Admin Dashboard

Repositorio de demonstracao para a aula de **Claude Code**, usando o banco de dados [Chinook](https://github.com/lerocha/chinook-database) (loja de musica) como base para construir um dashboard administrativo com Next.js.

## Stack

- **Next.js 15** com Turbopack e React 19
- **Drizzle ORM** com driver `postgres.js`
- **PostgreSQL 15** via Docker (local) ou Neon (remoto)
- **Tailwind CSS 4** + shadcn/ui
- **Turborepo** (monorepo com `apps/web` e `packages/db`)

## Pre-requisitos

- [Bun](https://bun.sh/) >= 1.3
- [Docker](https://www.docker.com/) rodando localmente

## Setup rapido

```bash
# 1. Instalar dependencias
bun install

# 2. Subir o banco de dados local
bun run infra:start

# 3. Popular o banco com dados do Chinook
bun run db:seed

# 4. Rodar a aplicacao
bun run dev
```

## Scripts disponiveis

| Script | Descricao |
|---|---|
| `bun run dev` | Inicia o servidor de desenvolvimento |
| `bun run build` | Build de producao |
| `bun run infra:start` | Sobe o container PostgreSQL |
| `bun run infra:stop` | Para o container PostgreSQL |
| `bun run db:seed` | Popula o banco (idempotente — pula se ja tem dados) |
| `bun run db:reinit` | Reset completo: destroi o volume, recria o container e roda o seed |
| `bun run db:studio` | Abre o Drizzle Studio para inspecionar o banco |

## Estrutura do projeto

```
.
├── apps/web/            # Next.js dashboard (artists, albums, tracks, customers, invoices, playlists)
├── packages/db/         # Drizzle ORM schema + client factory
├── scripts/             # Shell scripts para seed e reinit do banco
├── prompts/             # Prompts usados na aula para demonstrar o Claude Code
├── chinook.sql          # Dump completo do banco Chinook (schema + dados)
├── DATABASE_SCHEMA.md   # Documentacao do schema com ERD
└── docker-compose.yml   # PostgreSQL 15 para desenvolvimento local
```

## Sobre o banco Chinook

O Chinook modela uma loja de musica digital com 11 tabelas: artistas, albuns, faixas, generos, playlists, funcionarios, clientes e faturas. Consulte o `DATABASE_SCHEMA.md` para detalhes completos.
