#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER="chinook-postgres"
COMPOSE_FILE="docker-compose.yml"

echo "⚠️  Isso vai DESTRUIR todos os dados do banco local e recriar do zero."
read -p "Tem certeza? (y/N): " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Cancelado."
  exit 0
fi

echo ""
echo "🗑️  Derrubando container e volume..."
docker compose -f "$COMPOSE_FILE" down -v

echo "🚀 Recriando container..."
docker compose -f "$COMPOSE_FILE" up -d

echo "⏳ Aguardando PostgreSQL ficar pronto..."
READY_COUNT=0
while [ "$READY_COUNT" -lt 2 ]; do
  if docker exec "$DB_CONTAINER" pg_isready -U chinook -d chinook > /dev/null 2>&1; then
    READY_COUNT=$((READY_COUNT + 1))
  else
    READY_COUNT=0
  fi
  sleep 2
done
echo "✅ PostgreSQL pronto!"

echo ""
echo "🌱 Rodando seed..."
./scripts/db-seed.sh
