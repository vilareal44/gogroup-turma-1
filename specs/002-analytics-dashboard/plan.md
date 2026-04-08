# Implementation Plan: Dashboard de Analytics/Vendas

**Branch**: `002-analytics-dashboard` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-analytics-dashboard/spec.md`

## Summary

Criar uma pagina `/analytics` no dashboard Chinook com KPI cards (receita total, invoices, ticket medio, clientes ativos), graficos de receita mensal, top 5 generos, top 5 paises, e top 10 artistas — todos filtraveis por periodo. A abordagem tecnica segue o padrao Server-First existente: dados agregados via Drizzle no Server Component, graficos renderizados em Client Components com Recharts, filtro via searchParams com formulario GET.

## Technical Context

**Language/Version**: TypeScript ^5  
**Primary Dependencies**: Next.js ^15 (App Router), React ^19, Drizzle ORM ^0.45, shadcn/ui ^4 (base-nova), Tailwind CSS ^4, Recharts (a instalar), lucide-react  
**Storage**: PostgreSQL (Neon serverless remoto / Docker local)  
**Testing**: Nenhum framework configurado — verificacao visual via browser  
**Target Platform**: Web (Vercel)  
**Project Type**: Web application (monorepo Turborepo)  
**Performance Goals**: Pagina carrega em < 3s, filtro atualiza em < 3s  
**Constraints**: Dados Chinook (~400 invoices, ~2000 invoice lines) — volume pequeno, sem necessidade de otimizacoes especiais  
**Scale/Scope**: Dashboard interno, single-user, sem concorrencia relevante

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Status | Justificativa |
|---|---|---|
| I. Monorepo com Separacao de Dominios | PASS | Novos arquivos em `apps/web/`. Queries usam `@chinook/db`. Nenhum pacote novo em `packages/`. |
| II. Server-First (Next.js App Router) | PASS | `page.tsx` sera async Server Component. Client Components usados apenas para graficos (requerem DOM/interatividade) e filtro de periodo (requer Select interativo). |
| III. SQL PascalCase com Double-Quotes | PASS | Schema Drizzle ja mapeia PascalCase. Queries usam os nomes Drizzle (camelCase no TS → PascalCase no SQL automaticamente). |
| IV. Server Actions como Camada de Dados | PASS | Funcoes de leitura chamadas diretamente no Server Component. Nao ha mutacoes nesta feature. |
| V. Infraestrutura Local via Docker | PASS | Nenhuma mudanca de infra. Banco existente suporta todas as queries. |
| VI. Bun como Package Manager | PASS | `bun add recharts` para instalar dependencia. |

**Re-check pos-Phase 1**: Todos os principios continuam sendo respeitados. Nenhuma violacao introduzida pelo design.

## Project Structure

### Documentation (this feature)

```text
specs/002-analytics-dashboard/
├── plan.md              # Este arquivo
├── spec.md              # Especificacao da feature
├── research.md          # Decisoes tecnicas (chart lib, filtro, queries)
├── data-model.md        # Entidades, queries de agregacao planejadas
├── quickstart.md        # Como rodar e testar
├── contracts/
│   └── analytics-data.md  # Tipos de dados Server → Client
├── checklists/
│   └── requirements.md    # Checklist de qualidade da spec
└── tasks.md             # (sera gerado pelo /speckit.tasks)
```

### Source Code (repository root)

```text
apps/web/
├── package.json                          # + recharts
└── src/
    ├── components/
    │   └── sidebar-nav.tsx               # Modificado: + item Analytics
    └── app/
        └── (dashboard)/
            └── analytics/
                ├── page.tsx              # Server Component: queries + layout
                ├── actions.ts            # Queries Drizzle de agregacao
                ├── loading.tsx           # Skeleton loading state
                ├── period-filter.tsx     # Client Component: filtro de periodo
                └── charts/
                    ├── revenue-chart.tsx  # Grafico de receita mensal (BarChart/LineChart)
                    ├── genre-chart.tsx    # Top 5 generos (BarChart horizontal ou PieChart)
                    ├── country-chart.tsx  # Top 5 paises (BarChart)
                    └── artist-table.tsx   # Top 10 artistas (Table ou BarChart)
```

**Structure Decision**: Segue o padrao existente de rotas do dashboard (`(dashboard)/<rota>/page.tsx + actions.ts + loading.tsx`). Componentes de grafico isolados em subdiretorio `charts/` por serem Client Components especificos desta pagina.

## Complexity Tracking

Nenhuma violacao da constituicao. Tabela nao aplicavel.

## Implementation Phases

### Phase 1: Dependencia + Navegacao (P3 — US7)

1. Instalar Recharts: `bun add recharts` em `apps/web/`
2. Adicionar item "Analytics" ao array `navItems` em `sidebar-nav.tsx` com icone `BarChart3` do lucide-react e `href: "/analytics"`
3. Criar `analytics/page.tsx` minimo (Server Component com titulo) para validar navegacao

**Verificacao**: Clicar em "Analytics" na sidebar navega para `/analytics` com pagina basica.

### Phase 2: Queries de Agregacao (P1 — US1, FR-013)

1. Criar `analytics/actions.ts` com funcoes `"use server"`:
   - `getKpis(from?: Date, to?: Date)` → `{ totalRevenue, invoiceCount, avgTicket, activeCustomers }`
   - `getMonthlyRevenue(from?: Date, to?: Date)` → `{ month, revenue }[]`
   - `getTopGenres(from?: Date, to?: Date)` → `{ name, revenue }[]` (limit 5)
   - `getTopCountries(from?: Date, to?: Date)` → `{ country, revenue }[]` (limit 5)
   - `getTopArtists(from?: Date, to?: Date)` → `{ name, revenue }[]` (limit 10)
2. Todas as queries usam o padrao existente: `db.select({...}).from(table).innerJoin(...).where(and(gte(...), lte(...))).groupBy(...).orderBy(desc(...))`
3. Converter `numeric` (string) → `number` no servidor

**Verificacao**: Chamar as funcoes no Server Component e logar os resultados. Comparar com queries SQL diretas no banco.

### Phase 3: KPI Cards + Layout (P1 — US1, FR-002)

1. Atualizar `analytics/page.tsx` para:
   - Ler `searchParams` (period, from, to) e calcular intervalo de datas
   - Chamar todas as funcoes de actions em paralelo (`Promise.all`)
   - Renderizar 4 KPI cards usando `<Card>` do shadcn/ui
2. KPI cards: receita total (formatado USD), count invoices, ticket medio (formatado USD), clientes ativos

**Verificacao**: Pagina `/analytics` exibe 4 cards com valores corretos.

### Phase 4: Filtro de Periodo (P1 — US2, FR-007, FR-008)

1. Criar `analytics/period-filter.tsx` (Client Component):
   - `<Select>` com opcoes: "Todos os dados", "Ultimos 6 meses", "Ultimo ano", "Customizado"
   - Campos `<input type="date">` para datas customizadas (visiveis apenas quando "Customizado" selecionado)
   - Submissao via `router.push()` atualizando searchParams
2. Integrar no `page.tsx`: renderizar `<PeriodFilter>` acima dos KPIs
3. Validar intervalo: se `from > to`, ignorar e usar todos os dados

**Verificacao**: Mudar filtro atualiza todos os KPIs. Testar todos os presets + customizado.

### Phase 5: Graficos (P2 — US3, US4, US5, FR-003, FR-004, FR-005)

1. Criar `charts/revenue-chart.tsx` (Client Component):
   - `<ResponsiveContainer>` + `<BarChart>` ou `<LineChart>` com dados mensais
   - Eixo X: meses, Eixo Y: receita
   - Tooltip com valor formatado
2. Criar `charts/genre-chart.tsx`:
   - `<BarChart layout="vertical">` ou `<PieChart>` com top 5 generos
3. Criar `charts/country-chart.tsx`:
   - `<BarChart>` com top 5 paises
4. Layout: graficos dispostos em grid responsivo (2 colunas em desktop, 1 em mobile)
5. Estado vazio: quando array de dados vazio, exibir mensagem "Sem dados no periodo selecionado"

**Verificacao**: Todos os graficos renderizam com dados corretos. Mudar filtro atualiza graficos.

### Phase 6: Top 10 Artistas (P3 — US6, FR-006)

1. Criar `charts/artist-table.tsx` (Client Component ou Server-rendered `<Table>`):
   - Tabela com colunas: posicao, nome do artista, receita
   - Ordenada por receita desc
2. Integrar no layout da pagina abaixo dos graficos

**Verificacao**: Tabela exibe 10 artistas com valores corretos.

### Phase 7: Loading State + Polish (FR-010, FR-011)

1. Criar `analytics/loading.tsx` com skeletons para KPI cards e graficos
2. Formatacao monetaria consistente (USD, 2 casas decimais) em todos os valores
3. Estados vazios amigaveis em todos os graficos
4. Responsividade: verificar layout em diferentes tamanhos de tela

**Verificacao visual no browser**: Pagina completa funcionando com todos os componentes, filtros, e estados.
