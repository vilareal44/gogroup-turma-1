# Research: Dashboard de Analytics/Vendas

**Feature**: 002-analytics-dashboard  
**Date**: 2026-04-07

## R1: Biblioteca de Charts

**Decision**: Recharts

**Rationale**: Recharts e a biblioteca de graficos React mais popular e madura. Suporta BarChart, LineChart, PieChart, ResponsiveContainer — todos os tipos necessarios para o dashboard. E compativel com Client Components do Next.js (os graficos precisam de interatividade do browser para tooltips e responsividade). O bundle size e aceitavel (~45kB gzipped para os componentes usados). Ja e sugerida na spec original.

**Alternatives considered**:
- **Chart.js + react-chartjs-2**: Mais leve, mas API menos idiomatica para React. Requer `canvas` que pode causar problemas com SSR.
- **Nivo**: Otima qualidade visual, mas bundle maior e API mais complexa para charts simples.
- **Tremor**: Integra bem com Tailwind, mas adiciona outra camada de componentes sobre o shadcn/ui existente.

## R2: Abordagem de Filtro por Periodo

**Decision**: Formulario GET com `searchParams` usando `<Select>` para presets e `<input type="date">` para datas customizadas.

**Rationale**: A constituicao do projeto (Principio II — Server-First) determina que busca/filtros DEVEM usar formularios nativos GET com `searchParams`, sem `useState` para termos de busca. As paginas existentes (invoices, tracks, artists) ja seguem este padrao com `<form>` + `<Input name="search">`. Para o filtro de periodo, usaremos:
- Um `<Select>` com opcoes pre-definidas: "Todos os dados", "Ultimo ano", "Ultimos 6 meses", "Customizado"
- Quando "Customizado" e selecionado, campos `<input type="date" name="from">` e `<input type="date" name="to">` aparecem
- O formulario submete via GET, atualizando `searchParams` (`?period=6m`, `?period=custom&from=2025-01-01&to=2025-06-30`)
- A `page.tsx` (Server Component) le os searchParams e passa o intervalo de datas para as queries

**Alternatives considered**:
- **Client-side state + fetch**: Violaria o Principio II (Server-First). Exigiria API routes e `useEffect`.
- **shadcn/ui DatePicker**: Nao esta instalado e requer `@radix-ui/react-popover` + `date-fns` — dependencias extras nao necessarias quando `<input type="date">` nativo resolve.

## R3: Graficos como Client Components

**Decision**: Componentes de graficos serao Client Components (`"use client"`), recebendo dados ja agregados como props do Server Component pai.

**Rationale**: A constituicao (Principio II) permite Client Components quando "interatividade do browser e necessaria". Graficos Recharts requerem DOM, eventos de mouse (tooltips), e responsividade — justificando o uso de `"use client"`. Os dados serao buscados e agregados no Server Component (`page.tsx`) via Drizzle, e passados como props serializaveis (arrays de objetos simples) para os componentes de grafico.

**Alternatives considered**:
- **Server-only rendering com SVG estático**: Perderia tooltips e responsividade. Recharts nao suporta SSR puro.

## R4: Estrutura de Queries de Agregacao

**Decision**: Usar o mesmo padrao do cron `daily-sales-report` — queries Drizzle com `sum()`, `count()`, `groupBy()`, `orderBy(desc(...))`, e filtro por `invoiceDate` via `gte/lte`.

**Rationale**: O projeto ja tem exemplos funcionais desse padrao em `apps/web/src/app/api/cron/daily-sales-report/route.ts`. As queries para KPIs e rankings seguem a mesma estrutura. O campo `invoice.total` e `numeric` (chega como `string` no TypeScript) — sera necessario converter para `number` antes de exibir.

## R5: Filtro de Periodo — Componente Client para Controle de UI

**Decision**: O formulario de filtro sera um Client Component (`"use client"`) que usa `useRouter` + `useSearchParams` para submeter via navegacao programatica ou um `<form>` com submit GET.

**Rationale**: O `<Select>` do shadcn/ui e baseado em `@base-ui/react/select` e requer JavaScript para o dropdown. Quando o usuario muda o preset, o formulario precisa reagir (mostrar/esconder campos de data customizada). Um Client Component minimo que controla esta logica e submete via `router.push()` com os searchParams atualizados respeita o espirito Server-First: os dados continuam sendo buscados no servidor, apenas o controle de UI e client-side.
