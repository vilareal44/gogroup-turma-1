# Quickstart: Dashboard de Analytics/Vendas

**Feature**: 002-analytics-dashboard  
**Date**: 2026-04-07

## Pre-requisitos

- Bun instalado (`bun --version` >= 1.3.8)
- Projeto clonado e na branch `002-analytics-dashboard`
- `.env` com `DATABASE_URL` configurado (Neon ou Docker local)
- Banco populado com dados do Chinook (`bun run db:seed`)

## Setup

```bash
# 1. Instalar dependencias (inclui recharts adicionado nesta feature)
bun install

# 2. Subir infra local (se usando Docker)
bun run infra:start

# 3. Rodar o dev server
bun run dev
```

## Acessar o Dashboard

1. Abra `http://localhost:3000` no browser
2. Clique em **"Analytics"** na sidebar esquerda (ou acesse diretamente `http://localhost:3000/analytics`)
3. A pagina exibe:
   - 4 KPI cards no topo (receita total, invoices, ticket medio, clientes ativos)
   - Grafico de receita mensal
   - Top 5 generos por receita
   - Top 5 paises por receita
   - Top 10 artistas mais vendidos

## Filtrar por Periodo

- Use o seletor de periodo no topo da pagina
- Opcoes: "Todos os dados", "Ultimos 6 meses", "Ultimo ano", "Customizado"
- No modo customizado, selecione data inicio e data fim

## Arquivos Criados/Modificados

| Arquivo | Tipo | Descricao |
|---|---|---|
| `apps/web/src/app/(dashboard)/analytics/page.tsx` | Novo | Server Component com queries e layout |
| `apps/web/src/app/(dashboard)/analytics/actions.ts` | Novo | Queries Drizzle de agregacao |
| `apps/web/src/app/(dashboard)/analytics/loading.tsx` | Novo | Skeleton loading state |
| `apps/web/src/app/(dashboard)/analytics/period-filter.tsx` | Novo | Client Component para filtro de periodo |
| `apps/web/src/app/(dashboard)/analytics/charts/*.tsx` | Novos | Client Components de graficos (Recharts) |
| `apps/web/src/components/sidebar-nav.tsx` | Modificado | Adicionado item "Analytics" |
| `apps/web/package.json` | Modificado | Adicionado `recharts` como dependencia |
