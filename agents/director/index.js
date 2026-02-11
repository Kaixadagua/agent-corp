/**
 * Agent Corp - Director
 * Orquestrador principal dos agentes
 */

const { getBus } = require('../shared/bus');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_PATH = '/home/lordc/.openclaw/workspace/agent-corp';

class Director {
  constructor() {
    this.bus = getBus();
    this.id = 'director';
    this.tasks = new Map();
    this.taskCounter = 0;
    
    this.init();
  }

  init() {
    console.log('[Director] Inicializando...');
    
    // Registrar no bus
    this.bus.registerAgent(this.id, 'director', [
      'coordination',
      'task-allocation',
      'conflict-resolution',
      'decision-making'
    ]);

    // Escutar mensagens
    this.bus.on(`message:${this.id}`, (msg) => this.handleMessage(msg));
    this.bus.on('agent:registered', (data) => this.onAgentRegistered(data));
    this.bus.on('agent:status', (data) => this.onAgentStatusChange(data));
    
    // Iniciar loops
    this.startTaskAllocationLoop();
    this.startMonitoringLoop();
    
    console.log('[Director] Pronto');
  }

  // Analisar necessidades do sistema
  analyzeSystemNeeds() {
    const needs = [];
    
    // Verificar código
    try {
      const utils = fs.readdirSync(path.join(REPO_PATH, 'src/utils'));
      if (utils.length < 5) {
        needs.push({
          type: 'code',
          priority: 'high',
          description: 'Criar mais utilitários',
          reason: `Apenas ${utils.length} utils encontrados`
        });
      }
    } catch (e) {}

    // Verificar documentação
    try {
      const docs = fs.readdirSync(path.join(REPO_PATH, 'docs'));
      if (docs.length < 3) {
        needs.push({
          type: 'docs',
          priority: 'medium',
          description: 'Melhorar documentação',
          reason: 'Documentação insuficiente'
        });
      }
    } catch (e) {}

    // Verificar testes
    try {
      const tests = fs.readdirSync(path.join(REPO_PATH, 'tests/utils'));
      if (tests.length < 3) {
        needs.push({
          type: 'code',
          priority: 'high',
          description: 'Adicionar mais testes',
          reason: `Apenas ${tests.length} testes encontrados`
        });
      }
    } catch (e) {}

    return needs;
  }

  // Alocar tarefa para agente
  allocateTask(need) {
    // Encontrar agente disponível
    const candidates = this.bus.getAgentsByType(need.type)
      .filter(a => a.status === 'idle');
    
    if (candidates.length === 0) {
      console.log(`[Director] Nenhum agente ${need.type} disponível`);
      return null;
    }

    // Escolher o melhor candidato (menos tarefas recentes)
    const agent = candidates[0];
    
    this.taskCounter++;
    const taskId = `task-${this.taskCounter}`;
    
    const task = {
      id: taskId,
      type: need.type,
      priority: need.priority,
      description: need.description,
      assignedTo: agent.id,
      status: 'assigned',
      createdAt: new Date().toISOString(),
      need: need
    };

    this.tasks.set(taskId, task);
    
    // Enviar mensagem ao agente
    this.bus.sendDirect(
      this.id,
      agent.id,
      'task:assigned',
      task,
      need.priority
    );

    console.log(`[Director] Tarefa ${taskId} alocada para ${agent.id}`);
    
    return task;
  }

  // Resolver conflitos
  resolveConflict(conflict) {
    console.log(`[Director] Resolvendo conflito:`, conflict);
    
    // Estratégia simples: prioridade baseada em tipo
    const priorities = {
      'critical': 100,
      'high': 75,
      'medium': 50,
      'low': 25
    };

    if (conflict.type === 'resource-contention') {
      // Dar prioridade ao agente com tarefa mais importante
      const winner = conflict.contenders.sort((a, b) => 
        priorities[b.taskPriority] - priorities[a.taskPriority]
      )[0];

      this.bus.sendDirect(
        this.id,
        winner.agentId,
        'conflict:resolved',
        { winner: true, resource: conflict.resource }
      );

      // Notificar perdedores
      conflict.contenders
        .filter(c => c.agentId !== winner.agentId)
        .forEach(c => {
          this.bus.sendDirect(
            this.id,
            c.agentId,
            'conflict:resolved',
            { winner: false, resource: conflict.resource, reason: 'lower-priority' }
          );
        });
    }
  }

  // Loop de alocação de tarefas
  startTaskAllocationLoop() {
    setInterval(() => {
      const needs = this.analyzeSystemNeeds();
      
      needs.forEach(need => {
        // Verificar se já existe tarefa similar
        const existing = Array.from(this.tasks.values())
          .filter(t => t.description === need.description && t.status !== 'completed')
          .length;
        
        if (existing === 0) {
          this.allocateTask(need);
        }
      });
    }, 60000); // A cada minuto
  }

  // Loop de monitoramento
  startMonitoringLoop() {
    setInterval(() => {
      // Enviar heartbeat
      this.bus.heartbeat(this.id);
      
      // Verificar tarefas pendentes
      const pending = Array.from(this.tasks.values())
        .filter(t => t.status === 'assigned' && 
          Date.now() - new Date(t.createdAt).getTime() > 30 * 60 * 1000);
      
      if (pending.length > 0) {
        console.log(`[Director] ${pending.length} tarefas pendentes há mais de 30min`);
        
        // Reatribuir tarefas pendentes
        pending.forEach(task => {
          console.log(`[Director] Reatribuindo tarefa ${task.id}`);
          this.tasks.delete(task.id);
          this.allocateTask(task.need);
        });
      }

      // Reportar status
      const stats = this.bus.getStats();
      console.log('[Director] Status:', {
        agents: stats.totalAgents,
        tasks: this.tasks.size,
        pending: pending.length
      });
      
    }, 30000); // A cada 30 segundos
  }

  // Handler de mensagens
  handleMessage(msg) {
    console.log(`[Director] Mensagem recebida de ${msg.from}:`, msg.type);
    
    switch (msg.type) {
      case 'task:complete':
        this.onTaskComplete(msg.payload);
        break;
        
      case 'task:progress':
        this.onTaskProgress(msg.payload);
        break;
        
      case 'conflict:report':
        this.resolveConflict(msg.payload);
        break;
        
      case 'help:request':
        this.handleHelpRequest(msg.from, msg.payload);
        break;
    }
  }

  onTaskComplete(task) {
    const stored = this.tasks.get(task.id);
    if (stored) {
      stored.status = 'completed';
      stored.completedAt = new Date().toISOString();
      console.log(`[Director] Tarefa ${task.id} completada por ${stored.assignedTo}`);
      
      // Broadcast para todos
      this.bus.broadcast(
        this.id,
        'task:completed',
        { taskId: task.id, agent: stored.assignedTo }
      );
    }
  }

  onTaskProgress(update) {
    const stored = this.tasks.get(update.taskId);
    if (stored) {
      stored.progress = update.progress;
      console.log(`[Director] Tarefa ${update.taskId}: ${update.progress}%`);
    }
  }

  onAgentRegistered(data) {
    console.log(`[Director] Novo agente: ${data.agentId} (${data.agentType})`);
    
    // Enviar boas-vindas
    this.bus.sendDirect(
      this.id,
      data.agentId,
      'welcome',
      { message: 'Bem-vindo ao Agent Corp!', director: this.id }
    );
  }

  onAgentStatusChange(data) {
    if (data.status === 'offline') {
      // Reatribuir tarefas do agente offline
      const agentTasks = Array.from(this.tasks.values())
        .filter(t => t.assignedTo === data.agentId && t.status === 'assigned');
      
      agentTasks.forEach(task => {
        console.log(`[Director] Reatribuindo tarefa ${task.id} (agente offline)`);
        this.tasks.delete(task.id);
        this.allocateTask(task.need);
      });
    }
  }

  handleHelpRequest(from, request) {
    console.log(`[Director] Pedido de ajuda de ${from}:`, request);
    
    // Encontrar agente que pode ajudar
    const helpers = this.bus.getAgentsByType(request.helpType)
      .filter(a => a.id !== from && a.status === 'idle');
    
    if (helpers.length > 0) {
      this.bus.sendDirect(
        this.id,
        helpers[0].id,
        'help:offer',
        { to: from, request }
      );
    }
  }
}

module.exports = Director;
