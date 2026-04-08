<!--
Sync Impact Report
==================
- Version change: 0.0.0 → 1.0.0
- This is the initial constitution — no prior version existed.
- Added principles:
  1. Monorepo com Separacao de Dominios
  2. Server-First (Next.js App Router)
  3. SQL PascalCase com Double-Quotes
  4. Server Actions como Camada de Dados
  5. Infraestrutura Local via Docker
  6. Bun como Package Manager
- Added sections:
  - Stack e Restricoes Tecnicas
  - Workflow de Desenvolvimento
  - Governance
- Templates requiring updates:
  - .specify/templates/plan-template.md — OK (no outdated references)
  - .specify/templates/spec-template.md — OK  (no outdated references)
  - .specify/templates/tasks-template.md — OK (no outdated references)
- Follow-up TODOs: none
-->

# Chinook Admin Dashboard Constitution

## Core Principles

### I. Monorepo com Separacao de Dominios

O projeto DEVE manter a estrutura de monorepo Turborepo com
separacao clara entre camadas:

- `packages/db` — schema Drizzle, factory `createDb()`, tipos
  compartilhados. Nenhuma logica de UI ou framework web.
- `apps/web` — Next.js App Router, componentes, Server Actions,
  rotas de API. Consome `@chinook/db` como dependencia.
- Novos pacotes compartilhados DEVEM residir em `packages/`.
  Novas aplicacoes DEVEM residir em `apps/`.
- Dependencias entre workspaces DEVEM ser declaradas
  explicitamente no `package.json` de cada workspace.

### II. Server-First (Next.js App Router)

Todo data fetching e renderizacao DEVE priorizar o servidor:

- Pages (`page.tsx`) DEVEM ser `async` Server Components que
  buscam dados diretamente via Drizzle, sem client-side fetch.
- Client Components (`"use client"`) DEVEM ser usados somente
  quando interatividade do browser e necessaria (formularios,
  hooks de estado, event listeners).
- Loading states DEVEM ser implementados via `loading.tsx`
  com skeletons que espelhem o layout final da pagina.
- Busca (search) DEVE usar formularios nativos GET com
  `searchParams`, sem `useState` para o termo de busca.

### III. SQL PascalCase com Double-Quotes

O banco Chinook usa PascalCase para tabelas e colunas.
Toda interacao com o banco DEVE respeitar essa convencao:

- Nomes de tabelas e colunas em queries SQL raw DEVEM usar
  aspas duplas (ex: `SELECT "Name" FROM public."Artist"`).
- O schema Drizzle em `packages/db/src/schema.ts` DEVE
  mapear os nomes PascalCase exatos do banco.
- Novas entidades DEVEM seguir o padrao PascalCase existente.

### IV. Server Actions como Camada de Dados

Mutacoes DEVEM ser implementadas exclusivamente via Server
Actions (`"use server"`) seguindo o padrao estabelecido:

- Cada rota DEVE ter um arquivo `actions.ts` dedicado.
- Funcoes de leitura: chamadas diretamente no Server Component.
- Funcoes de mutacao: consumidas via `useActionState` no
  Client Component.
- Validacao DEVE usar Zod com `.safeParse()`, retornando
  `{ error: string }` ou `{ success: true }`.
- Toda mutacao DEVE chamar `revalidatePath()` apos sucesso
  para invalidar o cache da rota.

### V. Infraestrutura Local via Docker

O ambiente de desenvolvimento local DEVE ser reproduzivel
e isolado:

- PostgreSQL 15 DEVE ser provisionado via `docker-compose.yml`.
- O script `db:seed` DEVE ser idempotente (pular se ja tem dados).
- O script `db:reinit` DEVE destruir e recriar do zero.
- A variavel `DATABASE_URL` no `.env` DEVE ser carregada com
  `export $(grep -v '^#' .env | xargs)`, nunca com `source .env`
  (o `&` na connection string quebra o shell).

### VI. Bun como Package Manager

O projeto usa Bun como package manager exclusivo:

- Todos os comandos de instalacao e execucao DEVEM usar `bun`
  (ex: `bun install`, `bun run dev`).
- NUNCA usar `npm`, `pnpm` ou `yarn`.
- O campo `packageManager` no `package.json` raiz DEVE
  refletir a versao do Bun em uso.

## Stack e Restricoes Tecnicas

| Camada | Tecnologia | Versao |
|---|---|---|
| Monorepo | Turborepo | ^2 |
| Package Manager | Bun | 1.3.8 |
| Framework | Next.js (App Router) | ^15 |
| UI | React | ^19 |
| ORM | Drizzle ORM | ^0.45 |
| Driver DB | postgres.js | ^3 |
| Componentes UI | shadcn/ui (base-nova) | ^4 |
| CSS | Tailwind CSS | ^4 |
| Validacao | Zod | ^3 |
| Banco (local) | PostgreSQL | 15 (Docker) |
| Banco (remoto) | Neon PostgreSQL | serverless |
| Deploy | Vercel | vercel.json |
| Linguagem | TypeScript | ^5 |

**Restricoes:**
- Nao ha framework de testes configurado no projeto.
- IDs sao calculados manualmente via `MAX() + 1` (Chinook nao
  usa SERIAL/AUTOINCREMENT).
- Deletes em cascata sao manuais no codigo (FKs sem
  `ON DELETE CASCADE`).
- Documentacao e commits DEVEM ser em portugues (pt-BR).

## Workflow de Desenvolvimento

1. **Setup local**: `bun install` → `bun run infra:start` →
   `bun run db:seed` → `bun run dev`.
2. **Novas features**: criar rota em
   `apps/web/src/app/(dashboard)/<rota>/` com `page.tsx`,
   `actions.ts`, `loading.tsx` e Client Components conforme
   necessidade.
3. **Schema changes**: editar `packages/db/src/schema.ts`,
   rodar `bun run db:generate` e `bun run db:push`.
4. **Verificacao visual**: alteracoes de UI DEVEM ser
   verificadas no browser antes de considerar a tarefa concluida.
5. **Deploy**: push para `main` aciona deploy automatico na
   Vercel. O cron `/api/cron/daily-sales-report` roda
   diariamente as 12:00 UTC.

## Governance

- Esta constituicao e o documento normativo do projeto.
  Em caso de conflito com outros documentos, a constituicao
  prevalece.
- Emendas DEVEM ser documentadas com justificativa, atualizacao
  de versao (SemVer) e data.
- O arquivo `CLAUDE.md` na raiz contem orientacoes operacionais
  para agentes de IA e DEVE ser mantido consistente com
  esta constituicao.
- Revisoes de compliance DEVEM ser feitas ao adicionar novos
  principios ou alterar a stack.

**Version**: 1.0.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-07
