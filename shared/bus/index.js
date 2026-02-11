/**
 * Agent Corp - Message Bus
 * Sistema de comunicação entre agentes
 */

const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

class MessageBus extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.channels = new Map();
    this.messageHistory = [];
    this.maxHistory = 1000;
  }

  // Registrar um agente no bus
  registerAgent(agentId, agentType, capabilities = []) {
    this.agents.set(agentId, {
      id: agentId,
      type: agentType,
      capabilities,
      status: 'idle',
      registeredAt: new Date().toISOString(),
      lastHeartbeat: Date.now()
    });
    
    this.emit('agent:registered', { agentId, agentType, capabilities });
    console.log(`[Bus] Agente registrado: ${agentId} (${agentType})`);
  }

  // Remover agente do bus
  unregisterAgent(agentId) {
    this.agents.delete(agentId);
    this.emit('agent:unregistered', { agentId });
    console.log(`[Bus] Agente removido: ${agentId}`);
  }

  // Enviar mensagem direta (point-to-point)
  sendDirect(from, to, type, payload, priority = 'medium') {
    const message = {
      id: uuidv4(),
      from,
      to,
      type,
      priority,
      payload,
      timestamp: new Date().toISOString(),
      channel: 'direct'
    };

    this._storeMessage(message);
    this.emit(`message:${to}`, message);
    this.emit('message:sent', message);
    
    return message.id;
  }

  // Broadcast para todos os agentes
  broadcast(from, type, payload, priority = 'medium') {
    const message = {
      id: uuidv4(),
      from,
      to: 'all',
      type,
      priority,
      payload,
      timestamp: new Date().toISOString(),
      channel: 'broadcast'
    };

    this._storeMessage(message);
    this.emit('message:broadcast', message);
    
    return message.id;
  }

  // Enviar para grupo por tipo
  sendToGroup(from, agentType, type, payload, priority = 'medium') {
    const message = {
      id: uuidv4(),
      from,
      to: `group:${agentType}`,
      type,
      priority,
      payload,
      timestamp: new Date().toISOString(),
      channel: 'group'
    };

    this._storeMessage(message);
    this.emit(`message:group:${agentType}`, message);
    
    return message.id;
  }

  // Criar canal dedicado
  createChannel(channelName, participants = []) {
    this.channels.set(channelName, {
      name: channelName,
      participants,
      createdAt: new Date().toISOString(),
      messages: []
    });
    
    console.log(`[Bus] Canal criado: ${channelName}`);
  }

  // Enviar mensagem para canal
  sendToChannel(from, channelName, type, payload) {
    const channel = this.channels.get(channelName);
    if (!channel) {
      console.error(`[Bus] Canal não encontrado: ${channelName}`);
      return null;
    }

    const message = {
      id: uuidv4(),
      from,
      to: channelName,
      type,
      payload,
      timestamp: new Date().toISOString(),
      channel: 'channel'
    };

    channel.messages.push(message);
    this.emit(`channel:${channelName}`, message);
    
    return message.id;
  }

  // Atualizar status do agente
  updateAgentStatus(agentId, status, metadata = {}) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastHeartbeat = Date.now();
      Object.assign(agent, metadata);
      
      this.emit('agent:status', { agentId, status, metadata });
    }
  }

  // Heartbeat do agente
  heartbeat(agentId) {
    this.updateAgentStatus(agentId, 'active');
  }

  // Obter agentes por tipo
  getAgentsByType(type) {
    return Array.from(this.agents.values()).filter(a => a.type === type);
  }

  // Obter agentes disponíveis (idle)
  getAvailableAgents() {
    return Array.from(this.agents.values()).filter(a => a.status === 'idle');
  }

  // Verificar saúde dos agentes
  checkAgentsHealth() {
    const now = Date.now();
    const timeout = 5 * 60 * 1000; // 5 minutos
    
    for (const [agentId, agent] of this.agents) {
      if (now - agent.lastHeartbeat > timeout) {
        this.updateAgentStatus(agentId, 'offline');
        this.emit('agent:timeout', { agentId });
      }
    }
  }

  // Armazenar mensagem no histórico
  _storeMessage(message) {
    this.messageHistory.push(message);
    if (this.messageHistory.length > this.maxHistory) {
      this.messageHistory.shift();
    }
  }

  // Obter histórico de mensagens
  getMessageHistory(filter = {}) {
    let messages = this.messageHistory;
    
    if (filter.from) {
      messages = messages.filter(m => m.from === filter.from);
    }
    if (filter.to) {
      messages = messages.filter(m => m.to === filter.to);
    }
    if (filter.type) {
      messages = messages.filter(m => m.type === filter.type);
    }
    
    return messages.slice(-100); // Últimas 100
  }

  // Estatísticas
  getStats() {
    const agents = Array.from(this.agents.values());
    return {
      totalAgents: agents.length,
      byType: agents.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {}),
      byStatus: agents.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      }, {}),
      totalMessages: this.messageHistory.length,
      activeChannels: this.channels.size
    };
  }
}

// Singleton
let instance = null;

module.exports = {
  getBus: () => {
    if (!instance) {
      instance = new MessageBus();
      
      // Check de saúde a cada minuto
      setInterval(() => instance.checkAgentsHealth(), 60000);
    }
    return instance;
  },
  MessageBus
};
