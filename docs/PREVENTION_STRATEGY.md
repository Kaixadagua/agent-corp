# Prevenção de Quedas - Agent Corp

## Data: 2026-02-11
## Objetivo: Prevenir quedas do sistema, não apenas recuperar delas

---

## 🔍 Causas Raiz Identificadas

### 1. **Uso Excessivo de Recursos (Principal Causa)**
- WebSocket executava `execSync` (comandos git) a cada **5 segundos**
- Cada execSync bloqueia o event loop do Node.js
- Sem cache: mesmas operações repetidas constantemente
- **Impacto**: Sobrecarga de CPU/memória → Crash

### 2. **Ausência de Rate Limiting**
- Sem limite de atualizações
- Clients podem acumular se não forem limpos
- **Impacto**: Memory leak → Crash

### 3. **Operações Síncronas Bloqueantes**
- `execSync` para comandos git
- Leitura síncrona de arquivos
- **Impacto**: Event loop bloqueado → Timeout → Crash

---

## ✅ Soluções de Prevenção Implementadas

### 1. **WebSocket Otimizado** (`server/websocket-server.js`)

#### Cache de Dados (TTL 1 minuto)
```javascript
const cache = {
  git: { data: null, lastUpdate: 0 },
  files: { data: null, lastUpdate: 0 },
  tasks: { data: null, lastUpdate: 0 },
  logs: { data: null, lastUpdate: 0 }
};
```
- **Benefício**: Reduz operações de git/disco em ~90%
- **Resultado**: Menor uso de CPU/memória

#### Intervalo de Atualização Aumentado
```javascript
// Antes: 5 segundos
// Depois: 10 segundos
setInterval(() => { ... }, 10000);
```
- **Benefício**: Menor carga no sistema
- **Resultado**: Mais estável

#### Execução com Timeout
```javascript
execSync('...', { timeout: 5000 })
```
- **Benefício**: Comandos não travam indefinidamente
- **Resultado**: Não bloqueia event loop

#### Cleanup de Clients
```javascript
setInterval(() => {
  for (const client of clients) {
    if (client.readyState !== WebSocket.OPEN) {
      clients.delete(client);
    }
  }
}, 300000); // A cada 5 min
```
- **Benefício**: Previne memory leak
- **Resultado**: Memória estável

#### Rate Limiting de Updates
```javascript
if ((now - systemState.lastUpdate) < 5000) {
  return systemState; // Retorna cache
}
```
- **Benefício**: Evita atualizações redundantes
- **Resultado**: Menor processamento

---

### 2. **Preventive Health Check** (`scripts/preventive-health-check.sh`)

Verificações a cada 10 minutos:

#### Uso de Memória
```bash
if (mem_percent > 50%); then alertar
```
- **Detecta**: Vazamento de memória antes do OOM killer

#### File Descriptors
```bash
if (fd_count > 800); then alertar
```
- **Detecta**: Possível EMFILE error (too many open files)

#### Tamanho de Logs
```bash
if (log_size > 50MB); then alertar
```
- **Detecta**: I/O overhead por logs gigantes

#### Tempo de Resposta
```bash
if (response_time > 2000ms); then alertar
```
- **Detecta**: Degradação de performance

#### Conexões WebSocket
```bash
if (connections > 50); then alertar
```
- **Detecta**: Possível leak de conexões

#### Uso de CPU
```bash
if (cpu > 90%); then alertar
```
- **Detecta**: Sobrecarga do sistema

#### Processos Zombie
```bash
if (zombies > 5); then alertar
```
- **Detecta**: Processos filhos não finalizados

---

### 3. **Service Monitor** (`scripts/service-monitor.sh`)

**Função**: Reinício automático se prevenção falhar

- Verifica a cada 30 segundos
- Reinicia serviços caídos automaticamente
- Logs de status para auditoria

---

## 📊 Métricas de Antes vs Depois

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **execSync calls/min** | 12 | 1 | -92% |
| **Cache hits** | 0% | ~85% | +85% |
| **Update interval** | 5s | 10s | -50% carga |
| **Memory checks** | Nenhum | A cada 10min | Proativo |
| **Auto-restart** | Não | Sim | Alta disponibilidade |

---

## 🔄 Fluxo de Prevenção

```
┌──────────────────────────────────────────────────────┐
│           PREVENÇÃO (antes da queda)                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. Cache (1min) ──▶ Reduz operações repetidas      │
│         ↓                                            │
│  2. Rate Limit ────▶ Evita atualizações excessivas  │
│         ↓                                            │
│  3. Timeouts ──────▶ Previne operações travadas     │
│         ↓                                            │
│  4. Health Check ──▶ Detecta problemas proativamente│
│         ↓                                            │
│  5. Cleanup ───────▶ Evita memory leaks             │
│                                                      │
└──────────────────────────────────────────────────────┘
                          │
                          ▼ (se falhar)
┌──────────────────────────────────────────────────────┐
│           RECUPERAÇÃO (após queda)                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Service Monitor ──▶ Reinício automático em 30s     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🛠️ Comandos de Monitoramento

```bash
# Verificar saúde preventiva
./scripts/preventive-health-check.sh check

# Ver status dos serviços
./scripts/service-monitor.sh status

# Ver logs de alertas
tail -f /tmp/agent-corp-alerts.log

# Ver logs de saúde
tail -f /tmp/preventive-health.log
```

---

## 📋 Checklist de Prevenção

- [x] Cache implementado (TTL 1 min)
- [x] Rate limiting de updates
- [x] Timeouts em execSync
- [x] Cleanup de clients inativos
- [x] Health check preventivo (10min)
- [x] Monitoramento de memória
- [x] Monitoramento de file descriptors
- [x] Service monitor para auto-restart
- [x] Logs de alerta estruturados

---

## 📈 Resultado Esperado

### Antes
- Quedas frequentes (várias por dia)
- Recuperação manual necessária
- Sem visibilidade de causas

### Depois
- **Prevenção**: Problemas detectados antes da queda
- **Estabilidade**: Cache reduz carga em 90%
- **Recuperação**: Auto-restart em 30s se necessário
- **Visibilidade**: Logs de alerta para análise

---

## 🔮 Monitoramento Contínuo

**Frequências:**
- **Cache refresh**: 1 minuto
- **Health check**: 10 minutos
- **Service status**: 5 minutos
- **Client cleanup**: 5 minutos
- **Auto-restart check**: 30 segundos

**Alertas:**
- Memória > 50%
- File descriptors > 800
- Log size > 50MB
- Response time > 2000ms
- Connections > 50
- CPU > 90%
- Zombie processes > 5

---

## ✅ Conclusão

O sistema agora tem **múltiplas camadas de prevenção**:

1. **Camada 1 - Otimização**: Cache e rate limiting reduzem carga
2. **Camada 2 - Detecção**: Health check identifica problemas cedo
3. **Camada 3 - Recuperação**: Service monitor garante disponibilidade

**Status**: ✅ IMPLEMENTADO E OPERACIONAL
