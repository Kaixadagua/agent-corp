# Agent Corp 🤖

> **Plataforma Multi-Agente de IA - Onde agentes colaboram para monitorar e melhorar projetos de software**

## 🎯 Missão

O **Agent Corp** é uma **plataforma de orquestração multi-agente** onde inteligências artificiais especializadas interagem, delegam tarefas e monitoram projetos externos de software, através de uma interface visual harmoniosa para humanos e IAs.

📖 **[Leia a Visão Completa →](MISSION.md)**

### O Que É

🤖 **Hub Multi-Agente** - Agentes se comunicam e colaboram  
📊 **Monitoramento** - Métricas de projetos externos em tempo real  
📋 **Orquestração** - Delegação inteligente de tarefas  
🎨 **Interface Dual** - Visual para humanos, estruturada para IAs  

### NÃO É

❌ Apenas um gerador de código  
❌ Sistema isolado sem contexto  
❌ Interface só para humanos  
❌ Ferramenta sem inteligência colaborativa

---

## 🏗️ Arquitetura

```

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT CORP                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   DIRECTOR   │  │  SPECIALISTS │  │   WATCHERS   │     │
│  │              │  │              │  │              │     │
│  │ • Coordena   │  │ • Code       │  │ • Health     │     │
│  │ • Decide     │  │ • Docs       │  │ • Quality    │     │
│  │ • Integra    │  │ • Infra      │  │ • Security   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│                  ┌────────┴────────┐                      │
│                  │   Message Bus   │                      │
│                  │  Comunicação    │                      │
│                  └────────┬────────┘                      │
│                           │                                │
│         ┌─────────────────┼─────────────────┐              │
│         ▼                 ▼                 ▼              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   feature   │  │     dev     │  │    main     │       │
│  │   branch    │  │  (integra)  │  │  (estável)  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Funcionalidades

### 📊 Dashboard Real-Time
- Monitoramento de tasks em tempo real
- Pipeline visual (Pending → Progress → Review → Merged)
- Status de merge e integração
- Métricas do repositório

**Acesso:** http://localhost:3001

### 🤖 Agentes Autônomos
- **Director:** Orquestração e alocação de tarefas
- **Code Specialist:** Refatoração, otimização, testes
- **Docs Specialist:** Documentação e guias
- **Infra Specialist:** Deploy e configurações

### 🔄 Melhoria Contínua Automática
- Cron jobs a cada 5 minutos
- Criação automática de melhorias
- PR e merge automático para `dev`
- Limpeza de branches obsoletas

## 📋 Estrutura do Projeto

```
agent-corp/
├── agents/
│   ├── director/           # Orquestrador principal
│   ├── specialists/        # Especialistas por área
│   │   ├── code/
│   │   ├── docs/
│   │   └── infra/
│   └── watchers/           # Monitores do sistema
├── shared/
│   └── bus/                # Message Bus para comunicação
├── server/
│   ├── websocket-server.js # Real-time updates
│   └── agentCorpWorker.js  # Background tasks
├── dashboard/              # Interface web
├── scripts/                # Automações
│   ├── cron-improvement.js
│   ├── cleanup-branches.js
│   └── service-monitor.sh
├── docs/                   # Documentação
└── memory/                 # Memória do sistema
    └── improvements/
```

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/Kaixadagua/agent-corp.git
cd agent-corp

# Instale dependências
npm install

# Inicie os serviços
npm run start:all
```

## 📈 Status do Sistema

| Serviço | Porta | Status |
|---------|-------|--------|
| Dashboard | 3001 | ✅ Online |
| WebSocket | 8081 | ✅ Online |
| Worker | 8080 | ✅ Online |

## 🔄 Workflows

### Ciclo de Vida de uma Task
1. **Director** detecta necessidade
2. **Specialist** é designado para executar
3. **Wacher** monitora a execução
4. **Merge** automático em `dev` após testes

### Pipeline de Melhorias
```
Idea → Analysis → Assignment → Execution → Review → Merge
```

## 📊 Métricas de Qualidade

### Obrigatórias (Quality Gates)
| Métrica | Target | Status |
|---------|--------|--------|
| Código funcional (sem TODOs) | 90% | 🔄 Em progresso |
| Testes unitários | 100% | 🔄 Em progresso |
| Documentação JSDoc | 100% | 🔄 Em progresso |
| Validação de sintaxe | 100% | ✅ Passando |
| Integração entre módulos | 80% | 🔄 Em progresso |

### Estatísticas
- **Total de commits:** 423+
- **Tasks completadas (V4):** 2/4
- **Código funcional:** Crescendo
- **TODOs legados:** 182 (em redução)

📈 **[Ver Dashboard](http://localhost:3001)**

## 🔧 Scripts Úteis

```bash
# Status dos serviços
./scripts/service-monitor.sh status

# Verificar saúde preventiva
./scripts/preventive-health-check.sh check

# Limpar branches merged
./scripts/cleanup-branches.js

# Dashboard
open http://localhost:3001
```

## 🛡️ Prevenção de Quedas

- **Cache:** 1 minuto de TTL para reduzir operações
- **Health Checks:** A cada 10 minutos
- **Service Monitor:** Reinício automático em 30s
- **Rate Limiting:** Evita sobrecarga

## 📝 Logs

- `/tmp/agent-corp-*.log` - Logs dos serviços
- `/tmp/dashboard-health.log` - Health checks
- `/tmp/preventive-health.log` - Prevenção

## 🤝 Contribuição

O Agent Corp é um sistema autônomo, mas você pode:
- Monitorar o dashboard
- Revisar PRs antes do merge para `main`
- Ajustar configurações em `scripts/config/`

## 📄 Licença

MIT - Veja [LICENSE](LICENSE) para detalhes.

---

**Status:** 🟢 Sistema operacional 24/7
**Última atualização:** $(date)
