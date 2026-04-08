# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SQL course project using the **Chinook** sample database (music store) hosted on **Neon PostgreSQL**. The work is writing and running SQL queries against a remote database.

## Database Connection

⚠️ **Gotcha:** O `DATABASE_URL` no `.env` contém `&` (ex: `sslmode=require&channel_binding=require`). **NÃO use `source .env`** — o shell interpreta `&` como operador e falha com `parse error near '&'`.

```bash
# ✅ Forma correta de carregar o .env e rodar uma query
export $(grep -v '^#' .env | xargs) && psql "$DATABASE_URL" -c 'SELECT 1'

# ❌ NÃO faça isso — vai falhar
source .env && psql "$DATABASE_URL" -c 'SELECT 1'
```

The `DATABASE_URL` environment variable is defined in `.env`. Always load it with `export $(grep ...)` before running `psql`.

## SQL Conventions

- Table and column names use **PascalCase** and **must be double-quoted** in SQL:
  ```sql
  SELECT "Name" FROM public."Artist" LIMIT 5;
  ```
- Schema reference: see `DATABASE_SCHEMA.md` for full table definitions, relationships, and record counts.

## Key Files

- `chinook.sql` — Full database dump (schema + seed data). Do not modify unless re-provisioning the database.
- `DATABASE_SCHEMA.md` — Schema documentation with ERD, column types, and FK relationships.
- `.env` — Contains `DATABASE_URL` (not committed to git).

## Verificação Final via Browser (obrigatório)

Sempre que fizer alterações em arquivos que afetam a interface web (HTML, CSS, JS, templates, dashboards, etc.), o **último passo do plano** deve ser verificar visualmente o resultado no browser usando as ferramentas do Chrome MCP (`mcp__claude-in-chrome__*`).

**O que fazer:**
1. Abra a página relevante no browser (navegue até a URL local ou recarregue a aba existente).
2. Leia o conteúdo da página (`read_page` ou `get_page_text`) para confirmar que a alteração está refletida.
3. Se houver erro visual ou funcional, corrija antes de considerar a tarefa concluída.

**Quando pular:** Alterações puramente backend (queries SQL, scripts CLI, configurações sem UI) não precisam de verificação via browser.

## Active Technologies
- TypeScript ^5 + Next.js ^15 (App Router), React ^19, Drizzle ORM ^0.45, shadcn/ui ^4 (base-nova), Tailwind CSS ^4, Recharts (a instalar), lucide-reac (002-analytics-dashboard)
- PostgreSQL (Neon serverless remoto / Docker local) (002-analytics-dashboard)

## Recent Changes
- 002-analytics-dashboard: Added TypeScript ^5 + Next.js ^15 (App Router), React ^19, Drizzle ORM ^0.45, shadcn/ui ^4 (base-nova), Tailwind CSS ^4, Recharts (a instalar), lucide-reac
