#!/bin/bash
# JUP Hourly Report - Relatório a cada 1 hora
# Reporta atualizações críticas no Telegram

set -euo pipefail

readonly TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
readonly REPORT_FILE="/tmp/jup-hourly-report-$(date +%Y%m%d-%H).txt"
readonly TELEGRAM_CHAT="7097829938"

# Coletar dados
cd ~/.openclaw/workspace/agent-corp

BRANCHES=$(git branch -r 2>/dev/null | wc -l)
COMMITS_HOUR=$(git log --all --oneline --since="1 hour ago" 2>/dev/null | wc -l)
UTILS=$(ls src/utils/*.js 2>/dev/null | wc -l)
TESTS=$(ls tests/utils/*.js 2>/dev/null | wc -l)
PENDING=$(ls memory/improvements/*.md 2>/dev/null | wc -l)
COMPLETED=$(ls memory/improvements/completed/*.md 2>/dev/null | wc -l)

# Verificar status dos serviços
WORKER_STATUS=$(curl -s http://localhost:8080/api/health 2>/dev/null | grep -q "healthy" && echo "✅ Online" || echo "❌ Offline")
DASHBOARD_STATUS=$(curl -s http://localhost:3001 2>/dev/null | grep -q "Agent Corp" && echo "✅ Online" || echo "❌ Offline")

# Gerar relatório
cat > "$REPORT_FILE" << EOF
╔════════════════════════════════════════════════════════════╗
║     🦊 AGENT CORP - RELATÓRIO HORÁRIO                      ║
║     $(date '+%H:%M - %d/%m/%Y')                              ║
╠════════════════════════════════════════════════════════════╣

📊 MÉTRICAS (Última Hora):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Commits: $COMMITS_HOUR
   Branches: $BRANCHES
   Utils: $UTILS | Tests: $TESTS
   Tasks: $PENDING pendente | $COMPLETED completadas

🔧 SERVIÇOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Worker API: $WORKER_STATUS
   Dashboard: $DASHBOARD_STATUS

📝 ÚLTIMAS ATIVIDADES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

# Adicionar últimas atividades
git log --all --oneline --since="1 hour ago" 2>/dev/null | head -5 >> "$REPORT_FILE" || echo "   (Sem atividades recentes)" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF

🔗 LINKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Dashboard: http://localhost:3001
   API: http://localhost:8080/api/health
   Repo: https://github.com/Kaixadagua/agent-corp

╚════════════════════════════════════════════════════════════╝
EOF

# Enviar para Telegram (se possível)
if command -v telegram-send &>/dev/null; then
    telegram-send --file "$REPORT_FILE" 2>/dev/null || true
fi

# Salvar relatório
cp "$REPORT_FILE" /tmp/jup-report-latest.txt

cat "$REPORT_FILE"
