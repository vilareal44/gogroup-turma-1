Crie um plano de implementação para um Dashboard de Analytics/Vendas no dashboard existente do Chinook music store.

## Requisitos

1. **Nova página** (`/analytics`) no dashboard com:
   - **KPI Cards** no topo: receita total, número de invoices, ticket médio, total de clientes ativos
   - **Gráfico de receita ao longo do tempo** (linha ou barras, agrupado por mês)
   - **Top 5 gêneros** por receita (gráfico de barras horizontal ou pizza)
   - **Top 5 países** por receita (gráfico de barras)
   - **Top 10 artistas** mais vendidos (tabela ou gráfico)

2. **Filtro por período**: permita filtrar os dados por intervalo de datas (ex: últimos 6 meses, último ano, ou datas customizadas). Os KPIs e gráficos devem refletir o filtro selecionado.

3. **Navegação**: adicione o link "Analytics" na sidebar existente (`SidebarNav`), com um ícone apropriado (ex: `BarChart3` do lucide-react).

## Restrições

- Use o Drizzle ORM já configurado no projeto (pacote `@repo/db`)
- Use uma biblioteca de charts leve e compatível com React Server Components ou Client Components (ex: Recharts)
- Mantenha o visual consistente com o restante do dashboard (shadcn/ui, Tailwind)
- Crie os arquivos dentro do app Next.js existente em `apps/web/`
- As queries devem usar JOINs e agregações SQL adequadas — evite carregar dados brutos e agregar no frontend
