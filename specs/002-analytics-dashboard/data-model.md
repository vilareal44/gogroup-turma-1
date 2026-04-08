# Data Model: Dashboard de Analytics/Vendas

**Feature**: 002-analytics-dashboard  
**Date**: 2026-04-07

## Entidades Existentes (somente leitura)

Este feature nao cria novas tabelas. Todas as entidades ja existem no schema Drizzle (`packages/db/src/schema.ts`). O dashboard consome dados via queries de agregacao sobre as tabelas existentes.

### Entidades Utilizadas

```
Artist (1) ──→ (N) Album (1) ──→ (N) Track (1) ──→ (N) InvoiceLine (N) ←── (1) Invoice (N) ←── (1) Customer
                                        │
                                        └──→ (1) Genre
```

| Entidade | Campos Consumidos | Uso no Dashboard |
|---|---|---|
| **Invoice** | `invoiceId`, `customerId`, `invoiceDate`, `total` | KPIs (receita, count, ticket medio), grafico temporal, filtro por periodo |
| **InvoiceLine** | `invoiceLineId`, `invoiceId`, `trackId`, `unitPrice`, `quantity` | JOIN para conectar vendas a tracks/generos/artistas |
| **Customer** | `customerId`, `country` | KPI clientes ativos, top paises |
| **Track** | `trackId`, `albumId`, `genreId` | JOIN transitivo para generos e artistas |
| **Album** | `albumId`, `artistId` | JOIN transitivo para artistas |
| **Artist** | `artistId`, `name` | Top 10 artistas |
| **Genre** | `genreId`, `name` | Top 5 generos |

### Tipos de Dados Relevantes

| Campo | Tipo SQL | Tipo Drizzle | Tipo TypeScript | Nota |
|---|---|---|---|---|
| `Invoice.Total` | `NUMERIC(10,2)` | `numeric` | `string` | Converter para `number` com `Number()` ou `parseFloat()` |
| `InvoiceLine.UnitPrice` | `NUMERIC(10,2)` | `numeric` | `string` | Idem |
| `InvoiceLine.Quantity` | `INTEGER` | `integer` | `number` | — |
| `Invoice.InvoiceDate` | `TIMESTAMP` | `timestamp` | `Date` | Usado para filtro de periodo e agrupamento mensal |

### Queries de Agregacao Planejadas

**Q1 — KPIs** (receita total, count invoices, ticket medio, clientes ativos):
```
FROM Invoice
  LEFT JOIN Customer ON Invoice.CustomerId = Customer.CustomerId
WHERE InvoiceDate BETWEEN :from AND :to
SELECT:
  - SUM(Total) AS totalRevenue
  - COUNT(InvoiceId) AS invoiceCount
  - AVG(Total) AS avgTicket
  - COUNT(DISTINCT CustomerId) AS activeCustomers
```

**Q2 — Receita mensal**:
```
FROM Invoice
WHERE InvoiceDate BETWEEN :from AND :to
GROUP BY DATE_TRUNC('month', InvoiceDate)
ORDER BY month ASC
SELECT:
  - DATE_TRUNC('month', InvoiceDate) AS month
  - SUM(Total) AS revenue
```

**Q3 — Top 5 generos**:
```
FROM InvoiceLine
  JOIN Invoice ON InvoiceLine.InvoiceId = Invoice.InvoiceId
  JOIN Track ON InvoiceLine.TrackId = Track.TrackId
  JOIN Genre ON Track.GenreId = Genre.GenreId
WHERE Invoice.InvoiceDate BETWEEN :from AND :to
GROUP BY Genre.GenreId, Genre.Name
ORDER BY SUM(InvoiceLine.UnitPrice * InvoiceLine.Quantity) DESC
LIMIT 5
```

**Q4 — Top 5 paises**:
```
FROM Invoice
  JOIN Customer ON Invoice.CustomerId = Customer.CustomerId
WHERE Invoice.InvoiceDate BETWEEN :from AND :to
GROUP BY Customer.Country
ORDER BY SUM(Invoice.Total) DESC
LIMIT 5
```

**Q5 — Top 10 artistas**:
```
FROM InvoiceLine
  JOIN Invoice ON InvoiceLine.InvoiceId = Invoice.InvoiceId
  JOIN Track ON InvoiceLine.TrackId = Track.TrackId
  JOIN Album ON Track.AlbumId = Album.AlbumId
  JOIN Artist ON Album.ArtistId = Artist.ArtistId
WHERE Invoice.InvoiceDate BETWEEN :from AND :to
GROUP BY Artist.ArtistId, Artist.Name
ORDER BY SUM(InvoiceLine.UnitPrice * InvoiceLine.Quantity) DESC
LIMIT 10
```

### Validacoes

- Periodo: `from` deve ser anterior a `to`. Se invalido, ignorar filtro e mostrar todos os dados.
- Valores monetarios: converter `string` → `number` no servidor antes de passar como props.
- Meses sem dados no grafico temporal: nao preencher gaps — mostrar apenas meses com vendas.
