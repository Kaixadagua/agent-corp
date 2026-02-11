#!/bin/bash
# JUP Dashboard Health Check - Verificação a cada 1h
# Analisa o dashboard e reporta problemas

set -euo pipefail

readonly TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
readonly REPORT_FILE="/tmp/dashboard-health-report-$(date +%Y%m%d-%H).txt"

echo "========================================" > "$REPORT_FILE"
echo "DASHBOARD HEALTH CHECK - $TIMESTAMP" >> "$REPORT_FILE"
echo "========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Verificar servidores
echo "🔍 Verificando servidores..." >> "$REPORT_FILE"

DASHBOARD_STATUS=$(curl -s http://localhost:3001 >/dev/null 2>&1 && echo "ONLINE" || echo "OFFLINE")
WS_STATUS=$(curl -s http://localhost:8081/api/health >/dev/null 2>&1 && echo "ONLINE" || echo "OFFLINE")
WORKER_STATUS=$(curl -s http://localhost:8080/api/health >/dev/null 2>&1 && echo "ONLINE" || echo "OFFLINE")

echo "  Dashboard (3001): $DASHBOARD_STATUS" >> "$REPORT_FILE"
echo "  WebSocket (8081): $WS_STATUS" >> "$REPORT_FILE"
echo "  Worker (8080): $WORKER_STATUS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Verificar dados da API
echo "📊 Verificando dados da API..." >> "$REPORT_FILE"

if [ "$WS_STATUS" = "ONLINE" ]; then
    API_DATA=$(curl -s http://localhost:8081/api/status 2>/dev/null || echo "{}")
    
    # Extrair métricas
    PENDING=$(echo "$API_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tasks',{}).get('pending',0))" 2>/dev/null || echo "0")
    PROGRESS=$(echo "$API_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tasks',{}).get('inProgress',0))" 2>/dev/null || echo "0")
    COMMITS=$(echo "$API_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('metrics',{}).get('commits',0))" 2>/dev/null || echo "0")
    
    echo "  Tasks Pending: ${PENDING:-0}" >> "$REPORT_FILE"
    echo "  Tasks In Progress: ${PROGRESS:-0}" >> "$REPORT_FILE"
    echo "  Commits (1h): ${COMMITS:-0}" >> "$REPORT_FILE"
    
    # Verificar anomalias
    ISSUES=0
    
    if [ "${COMMITS:-0}" -eq 0 ]; then
        echo "  ⚠️  ALERTA: Nenhum commit na última hora" >> "$REPORT_FILE"
        ISSUES=$((ISSUES + 1))
    fi
    
    if [ "${PENDING:-0}" -gt 10 ]; then
        echo "  ⚠️  ALERTA: Muitas tarefas pendentes (${PENDING})" >> "$REPORT_FILE"
        ISSUES=$((ISSUES + 1))
    fi
    
    echo "" >> "$REPORT_FILE"
    echo "  Total de issues encontradas: $ISSUES" >> "$REPORT_FILE"
else
    echo "  ❌ API offline - não foi possível verificar dados" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "✅ Verificação completa" >> "$REPORT_FILE"
echo "========================================" >> "$REPORT_FILE"

# Mostrar relatório
cat "$REPORT_FILE"
