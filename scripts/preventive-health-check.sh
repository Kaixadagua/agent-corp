#!/bin/bash
# Agent Corp - Preventive Health Monitor
# Identifica problemas ANTES que causem quedas

REPO_PATH="/home/lordc/.openclaw/workspace/agent-corp"
ALERT_LOG="/tmp/agent-corp-alerts.log"
HEALTH_LOG="/tmp/agent-corp-preventive-health.log"

log_alert() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ALERTA: $1" >> "$ALERT_LOG"
    echo "⚠️  $1"
}

log_info() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1" >> "$HEALTH_LOG"
}

# 1. Verificar uso de memória dos processos Node
check_memory_usage() {
    local node_pids=$(pgrep -f "node.*server" | head -5)
    
    for pid in $node_pids; do
        if [ -n "$pid" ]; then
            local mem_percent=$(ps -p $pid -o %mem= 2>/dev/null | tr -d ' ')
            if [ -n "$mem_percent" ]; then
                # Se uso de memória > 50%, alertar
                if (( $(echo "$mem_percent > 50" | bc -l) )); then
                    log_alert "WebSocket PID $pid usando ${mem_percent}% de memória"
                fi
            fi
        fi
    done
}

# 2. Verificar handles de arquivo (pode causar EMFILE error)
check_file_descriptors() {
    local node_pids=$(pgrep -f "node.*server" | head -5)
    
    for pid in $node_pids; do
        if [ -n "$pid" ] && [ -d "/proc/$pid" ]; then
            local fd_count=$(ls -1 /proc/$pid/fd 2>/dev/null | wc -l)
            if [ "$fd_count" -gt 800 ]; then
                log_alert "PID $pid usando $fd_count file descriptors (próximo do limite)"
            fi
        fi
    done
}

# 3. Verificar crescimento de logs (pode causar I/O overhead)
check_log_sizes() {
    local max_size=$((50 * 1024 * 1024))  # 50MB
    
    for logfile in /tmp/agent-corp-*.log /tmp/websocket-server.log; do
        if [ -f "$logfile" ]; then
            local size=$(stat -f%z "$logfile" 2>/dev/null || stat -c%s "$logfile" 2>/dev/null || echo 0)
            if [ "$size" -gt "$max_size" ]; then
                log_alert "Log $logfile muito grande ($(($size / 1024 / 1024))MB) - rotacionar recomendado"
            fi
        fi
    done
}

# 4. Verificar execSync hanging (timeout de comandos git)
check_git_operations() {
    # Verificar se há processos git travados
    local git_processes=$(pgrep -x git | wc -l)
    if [ "$git_processes" -gt 5 ]; then
        log_alert "Muitos processos git ($git_processes) - possível operação travada"
    fi
}

# 5. Verificar se WebSocket está respondendo em tempo hábil
check_websocket_response() {
    local start_time=$(date +%s%N)
    local response=$(curl -s -m 5 http://localhost:8081/api/health 2>/dev/null)
    local end_time=$(date +%s%N)
    
    if [ -z "$response" ]; then
        log_alert "WebSocket não respondeu em 5 segundos"
    else
        # Calcular tempo de resposta (em ms)
        local response_time=$(( (end_time - start_time) / 1000000 ))
        if [ "$response_time" -gt 2000 ]; then
            log_alert "WebSocket lento: ${response_time}ms (deve ser < 500ms)"
        fi
    fi
}

# 6. Verificar número de conexões WebSocket ativas
check_websocket_connections() {
    local ws_connections=$(lsof -i :8081 2>/dev/null | grep ESTABLISHED | wc -l)
    if [ "$ws_connections" -gt 50 ]; then
        log_alert "Muitas conexões WebSocket ($ws_connections) - possível leak"
    fi
}

# 7. Verificar CPU usage sustentado
check_cpu_usage() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 | tr -d ' ')
    if [ -n "$cpu_usage" ]; then
        if (( $(echo "$cpu_usage > 90" | bc -l 2>/dev/null || echo 0) )); then
            log_alert "CPU alta: ${cpu_usage}% - verificar processos"
        fi
    fi
}

# 8. Verificar zombie processes
check_zombie_processes() {
    local zombies=$(ps aux | awk '{if ($8=="Z") print $0}' | wc -l)
    if [ "$zombies" -gt 5 ]; then
        log_alert "$zombies processos zombie detectados"
    fi
}

# Executar todas as verificações
run_checks() {
    echo "=== Preventive Health Check ==="
    echo "Data: $(date)"
    echo ""
    
    check_memory_usage
    check_file_descriptors
    check_log_sizes
    check_git_operations
    check_websocket_response
    check_websocket_connections
    check_cpu_usage
    check_zombie_processes
    
    echo ""
    echo "=== Verificação completa ==="
    
    # Se houver alertas, mostrar resumo
    if [ -f "$ALERT_LOG" ]; then
        local recent_alerts=$(tail -20 "$ALERT_LOG" | grep "$(date '+%Y-%m-%d')" | wc -l)
        if [ "$recent_alerts" -gt 0 ]; then
            echo "⚠️  $recent_alerts alertas hoje - ver $ALERT_LOG"
        else
            echo "✅ Nenhum alerta - sistema saudável"
        fi
    fi
}

# Se executado diretamente
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    case "${1:-check}" in
        check)
            run_checks
            ;;
        monitor)
            # Modo monitor contínuo
            while true; do
                run_checks >> "$HEALTH_LOG" 2>&1
                sleep 300  # A cada 5 minutos
            done
            ;;
        *)
            echo "Uso: $0 {check|monitor}"
            exit 1
            ;;
    esac
fi
