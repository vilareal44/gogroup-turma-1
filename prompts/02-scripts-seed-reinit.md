Crie scripts shell em uma pasta scripts/ para gerenciar o banco local:

1. scripts/db-seed.sh — Seed idempotente: verifica se o banco já tem dados, se sim pula, se não carrega o chinook.sql. Mostra contagem no final.
2. scripts/db-reinit.sh — Reinicialização completa: pede confirmação, destrói o volume Docker, recria o container, espera o postgres ficar pronto, e roda o seed automaticamente.

Adicione no package.json:
- "db:seed": "chmod +x scripts/db-seed.sh && ./scripts/db-seed.sh"
- "db:reinit": "chmod +x scripts/db-reinit.sh && ./scripts/db-reinit.sh"

Teste os dois comandos para garantir que funcionam.
