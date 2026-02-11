#!/bin/bash
# Agent Corp Service Monitor
# Garante que os serviços estejam sempre rodando

SERVICES=(
    "8081:websocket:/home/lordc/.openclaw/workspace/agent-corp/server/websocket-server.js:node"
    "3001:dashboard:/home/lordc/.openclaw/workspace/agent-corp/dashboard:python3 -m http.server 3001"
    "8080:worker:/home/lordc/.openclaw/workspace/agent-corp/server/agentCorpWorker.js:node"
)

LOG_DIR="/tmp"
PID_DIR="/tmp/agent-corp-pids"

mkdir -p "$PID_DIR"

check_service() {
    local port=$1
    local name=$2
    
    if lsof -i :$port >/dev/null 2>&1; then
        return 0  # Rodando
    else
        return 1  # Parado
    fi
}

start_service() {
    local port=$1
    local name=$2
    local workdir=$3
    local cmd=$4
    
    echo "[$(date '+%H:%M:%S')] Iniciando $name na porta $port..."
    
    cd "$workdir" || exit 1
    nohup $cmd > "$LOG_DIR/${name}.log" 2>&1 &
    local pid=$!
    
    echo $pid > "$PID_DIR/${name}.pid"
    
    sleep 2
    
    if check_service $port; then
        echo "[$(date '+%H:%M:%S')] ✅ $name iniciado (PID: $pid)"
        return 0
    else
        echo "[$(date '+%H:%M:%S')] ❌ Falha ao iniciar $name"
        return 1
    fi
}

monitor() {
    echo "[$(date '+%H:%M:%S')] Iniciando monitoramento..."
    
    while true; do
        for service in "${SERVICES[@]}"; do
            IFS=':' read -r port name workdir cmd <<< "$service"
            
            if ! check_service $port; then
                echo "[$(date '+%H:%M:%S')] ⚠️  $name (porta $port) está offline!"
                start_service $port $name "$workdir" "$cmd"
            fi
        done
        
        # Verificar a cada 30 segundos
        sleep 30
    done
}

status() {
    echo "=== STATUS DOS SERVIÇOS ==="
    echo ""
    for service in "${SERVICES[@]}"; do
        IFS=':' read -r port name workdir cmd <<< "$service"
        
        if check_service $port; then
            pid=$(cat "$PID_DIR/${name}.pid" 2>/dev/null || echo "?")
            echo "✅ $name (porta $port) - PID: $pid"
        else
            echo "❌ $name (porta $port) - OFFLINE"
        fi
    done
}

case "${1:-monitor}" in
    monitor)
        monitor
        ;;
    status)
        status
        ;;
    start)
        for service in "${SERVICES[@]}"; do
            IFS=':' read -r port name workdir cmd <<< "$service"
            if ! check_service $port; then
                start_service $port $name "$workdir" "$cmd"
            else
                echo "✅ $name já está rodando"
            fi
        done
        ;;
    *)
        echo "Uso: $0 {monitor|status|start}"
        exit 1
        ;;
esac
