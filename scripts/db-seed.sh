#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER="chinook-postgres"
DB_NAME="chinook"
DB_USER="chinook"

echo "🌱 Verificando seed do banco..."

# Checa se o container está rodando
if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
  echo "❌ Container '${DB_CONTAINER}' não está rodando. Execute: pnpm infra:start"
  exit 1
fi

# Verifica se já existem dados (tabela Artist com registros)
COUNT=$(docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -tAc \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null || echo "0")

if [ "$COUNT" -gt "0" ]; then
  echo "✅ Banco já possui $COUNT tabelas. Seed não necessário."
else
  echo "📦 Carregando chinook.sql..."
  docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < chinook.sql
  echo "✅ Seed concluído!"
fi

# Mostra contagem de registros por tabela
echo ""
echo "📊 Contagem de registros:"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c \
  "SELECT schemaname || '.' || relname AS tabela, n_live_tup AS registros
   FROM pg_stat_user_tables ORDER BY relname;"
