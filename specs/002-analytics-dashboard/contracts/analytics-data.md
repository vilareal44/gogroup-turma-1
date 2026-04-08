# Contract: Analytics Data Interface

**Feature**: 002-analytics-dashboard  
**Date**: 2026-04-07

## Descricao

Define os tipos de dados que fluem do Server Component (page.tsx) para os Client Components de graficos. Nao ha API REST exposta — os dados sao passados como props serializadas.

## SearchParams (URL)

```
/analytics                           → todos os dados (sem filtro)
/analytics?period=6m                 → ultimos 6 meses
/analytics?period=1y                 → ultimo ano
/analytics?period=custom&from=YYYY-MM-DD&to=YYYY-MM-DD → intervalo customizado
```

| Param | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `period` | `"6m" \| "1y" \| "custom"` | Nao | Preset de periodo. Ausente = todos os dados |
| `from` | `string (YYYY-MM-DD)` | Somente se `period=custom` | Data inicio |
| `to` | `string (YYYY-MM-DD)` | Somente se `period=custom` | Data fim |

## Tipos de Dados (Server → Client)

### KPIs

```typescript
type KpiData = {
  totalRevenue: number      // soma de Invoice.Total no periodo
  invoiceCount: number      // contagem de invoices no periodo
  avgTicket: number         // totalRevenue / invoiceCount
  activeCustomers: number   // COUNT(DISTINCT CustomerId) no periodo
}
```

### Receita Mensal

```typescript
type MonthlyRevenue = {
  month: string    // formato "YYYY-MM" (ex: "2025-06")
  revenue: number  // soma de Invoice.Total naquele mes
}[]
```

### Top Generos

```typescript
type TopGenre = {
  name: string      // Genre.Name
  revenue: number   // soma de UnitPrice * Quantity
}[]  // array de 5 elementos, ordenado desc por revenue
```

### Top Paises

```typescript
type TopCountry = {
  country: string   // Customer.Country
  revenue: number   // soma de Invoice.Total
}[]  // array de 5 elementos, ordenado desc por revenue
```

### Top Artistas

```typescript
type TopArtist = {
  name: string      // Artist.Name
  revenue: number   // soma de UnitPrice * Quantity
}[]  // array de 10 elementos, ordenado desc por revenue
```
