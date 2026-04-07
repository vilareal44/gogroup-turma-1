---
name: commit
description: "Faz stage das mudanças da sessão e cria um commit com mensagem gerada por IA"
allowed-tools: Bash, AskUserQuestion
---

# Comando de Commit

Cria um commit bem formatado para as mudanças feitas durante a sessão atual.

## Instruções

1. Rode `git diff` e `git diff --cached` para verificar mudanças staged e unstaged
2. Rode `git status` para ver todas as mudanças (NÃO use a flag -uall)
3. Rode `git log --oneline -5` para ver o estilo das mensagens de commit recentes

### Determinar o que commitar

4. Verifique se há mudanças da conversa/sessão atual (arquivos que você editou ou criou durante esta sessão)
   - **Se HOUVER mudanças da sessão**: Faça stage e commit apenas desses arquivos específicos — NÃO inclua mudanças não relacionadas que já existiam antes da sessão
   - **Se NÃO houver mudanças da sessão**: Use AskUserQuestion para perguntar ao usuário se ele quer commitar todas as mudanças pendentes. Se ele recusar, pare aqui.

### Criar o commit

5. Analise as mudanças a serem commitadas e escreva uma mensagem de commit que:
   - Resuma a natureza das mudanças (feature, fix, refactor, docs, test, etc.)
   - Use o modo imperativo ("Adiciona feature" e não "Adicionada feature")
   - Seja concisa (1-2 frases) focando no "porquê" e não apenas no "o quê"
   - Siga o estilo de commit do repositório baseado nos commits recentes
6. Faça stage dos arquivos relevantes com `git add <arquivo1> <arquivo2> ...` (apenas arquivos da sessão, ou todos se o usuário confirmou)
7. Crie o commit usando HEREDOC para formatação correta:

```bash
git commit -m "$(cat <<'EOF'
Sua mensagem de commit aqui

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

8. Rode `git status` para verificar se o commit foi bem-sucedido

## Importante

- NÃO commite arquivos que contenham segredos (.env, credenciais, chaves de API)
- Se hooks de pre-commit falharem, corrija os problemas e crie um NOVO commit (não faça amend)
- Se não houver mudanças para commitar, informe o usuário
- Prefira fazer stage de arquivos específicos pelo nome ao invés de `git add -A`