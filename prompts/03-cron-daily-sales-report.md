Crie um plano de implementação para uma API route (Next.js App Router) que gera um relatório diário de vendas a partir do banco Chinook e envia para um canal Slack mock.

## Requisitos

1. **API Route** (`/api/cron/daily-sales-report`) que:
   - Consulta o banco Chinook e calcula: total faturado no dia, número de invoices, ticket médio, e top 5 artistas mais vendidos
   - Formata o resultado como mensagem Slack (Block Kit ou texto markdown)
   - Envia via webhook para um Slack mock (use https://httpbin.org/post ou similar como destino fake para simular o webhook)
   - Retorna o JSON do relatório gerado na response

2. **Proteção do endpoint** com um header ou query param de segurança simples (ex: `Authorization: Bearer <CRON_SECRET>` vindo de env var) para que não seja chamado por qualquer um.

3. **Scheduling**: configure um cron job usando Vercel Cron (vercel.json) para rodar diariamente. Documente como testar manualmente via curl.

## Restrições

- Use o Drizzle ORM já configurado no projeto (pacote `@repo/db`)
- Mantenha tudo simples — é um exemplo didático, não precisa de filas, retry, etc.
- Crie os arquivos dentro do app Next.js existente em `apps/web/`
