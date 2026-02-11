#!/bin/bash
# JUP Hourly Report - Relatorio simples sem caracteres especiais problematicos

cd ~/.openclaw/workspace/agent-corp 2>/dev/null || exit 1

BRANCHES=$(git branch 2>/dev/null | wc -l)
COMMITS_HOUR=$(git log --all --oneline --since="1 hour ago" 2>/dev/null | wc -l)
UTILS=$(ls src/utils/*.js 2>/dev/null | wc -l)
TESTS=$(ls tests/utils/*.js 2>/dev/null | wc -l)

WORKER_STATUS=$(curl -s http://localhost:8080/api/health 2>/dev/null | grep -q "healthy" && echo "OK" || echo "OFF")
DASHBOARD_STATUS=$(curl -s http://localhost:3001 2>/dev/null | grep -q "Agent Corp" && echo "OK" || echo "OFF")

echo "========================================"
echo "AGENT CORP - RELATORIO HORARIO"
echo "$(date '+%H:%M - %d/%m/%Y')"
echo "========================================"
echo ""
echo "METRICAS (Ultima Hora):"
echo "  Commits: $COMMITS_HOUR"
echo "  Branches: $BRANCHES"
echo "  Utils: $UTILS | Tests: $TESTS"
echo ""
echo "SERVICOS:"
echo "  Worker API: $WORKER_STATUS"
echo "  Dashboard: $DASHBOARD_STATUS"
echo ""
echo "ULTIMAS ATIVIDADES:"
git log --all --oneline --since="1 hour ago" 2>/dev/null | head -5 || echo "  (Sem atividades)"
echo ""
echo "========================================"
echo "Dashboard: http://localhost:3001"
echo "========================================"
