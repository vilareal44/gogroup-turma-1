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
