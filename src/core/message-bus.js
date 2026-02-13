#!/usr/bin/env node
/**
 * Agent-Corp Message Bus
 * Sistema de comunicação pub/sub entre agentes
 * 
 * @module core/message-bus
 * @version 1.0.0
 */

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class MessageBus extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = {
      persistenceDir: options.persistenceDir || './data/messages',
      maxMessages: options.maxMessages || 1000,
      retentionTime: options.retentionTime || 24 * 60 * 60 * 1000, // 24h
      ...options
    };
    
    this.messages = new Map();
    this.subscribers = new Map();
    this.agents = new Map();
    
    // Garantir diretório de persistência
    if (!fs.existsSync(this.options.persistenceDir)) {
      fs.mkdirSync(this.options.persistenceDir, { recursive: true });
    }
    
    // Limpeza periódica
    setInterval(() => this.cleanup(), 60 * 60 * 1000); // A cada hora
  }

  /**
   * Registrar um agente no message bus
   */
  registerAgent(agentId, agentInfo) {
    this.agents.set(agentId, {
      id: agentId,
      ...agentInfo,
      registeredAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      status: 'online'
    });
    
    this.emit('agent:registered', { agentId, agentInfo });
    console.log(`[MessageBus] Agent registered: ${agentId}`);
  }

  /**
   * Desregistrar um agente
   */
  unregisterAgent(agentId) {
    this.agents.delete(agentId);
    this.emit('agent:unregistered', { agentId });
    console.log(`[MessageBus] Agent unregistered: ${agentId}`);
  }

  /**
   * Publicar mensagem
   */
  publish(message) {
    const msg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...message
    };
    
    // Validar mensagem
    if (!this.validateMessage(msg)) {
      console.error('[MessageBus] Invalid message format:', msg);
      return null;
    }
    
    // Armazenar mensagem
    this.messages.set(msg.id, msg);
    
    // Persistir se necessário
    if (msg.priority === 'HIGH' || msg.priority === 'CRITICAL') {
      this.persistMessage(msg);
    }
    
    // Notificar subscribers do canal
    const channel = msg.channel || 'default';
    this.emit(`channel:${channel}`, msg);
    
    // Notificar agente destinatário específico
    if (msg.to && msg.to !== 'broadcast') {
      this.emit(`agent:${msg.to}`, msg);
    }
    
    // Notificar agente remetente (para confirmação)
    this.emit(`agent:${msg.from}:sent`, msg);
    
    console.log(`[MessageBus] Message published: ${msg.id} on channel ${channel}`);
    return msg.id;
  }

  /**
   * Subscrever em um canal
   */
  subscribe(channel, callback, agentId = null) {
    const eventName = `channel:${channel}`;
    this.on(eventName, callback);
    
    if (agentId) {
      if (!this.subscribers.has(agentId)) {
        this.subscribers.set(agentId, new Set());
      }
      this.subscribers.get(agentId).add(channel);
    }
    
    console.log(`[MessageBus] Subscribed to channel: ${channel}`);
    
    // Retornar função de unsubscribe
    return () => {
      this.off(eventName, callback);
      if (agentId && this.subscribers.has(agentId)) {
        this.subscribers.get(agentId).delete(channel);
      }
    };
  }

  /**
   * Subscrever em mensagens direcionadas a um agente
   */
  subscribeToAgent(agentId, callback) {
    const eventName = `agent:${agentId}`;
    this.on(eventName, callback);
    
    console.log(`[MessageBus] Subscribed to agent: ${agentId}`);
    
    return () => {
      this.off(eventName, callback);
    };
  }

  /**
   * Solicitar ajuda de outro agente
   */
  requestHelp(fromAgent, toAgent, task, context = {}) {
    return this.publish({
      from: fromAgent,
      to: toAgent,
      type: 'REQUEST',
      channel: 'help:needed',
      priority: 'HIGH',
      payload: {
        task,
        context,
        requestedAt: new Date().toISOString()
      }
    });
  }

  /**
   * Responder a uma solicitação
   */
  respondTo(requestId, fromAgent, toAgent, response, success = true) {
    return this.publish({
      from: fromAgent,
      to: toAgent,
      type: 'RESPONSE',
      channel: 'help:response',
      priority: 'NORMAL',
      inReplyTo: requestId,
      payload: {
        success,
        response,
        respondedAt: new Date().toISOString()
      }
    });
  }

  /**
   * Broadcast para todos os agentes
   */
  broadcast(fromAgent, channel, payload, priority = 'NORMAL') {
    return this.publish({
      from: fromAgent,
      to: 'broadcast',
      type: 'EVENT',
      channel,
      priority,
      payload
    });
  }

  /**
   * Listar agentes online
   */
  getOnlineAgents() {
    return Array.from(this.agents.values()).filter(
      agent => agent.status === 'online'
    );
  }

  /**
   * Listar mensagens recentes
   */
  getRecentMessages(limit = 50, channel = null) {
    let msgs = Array.from(this.messages.values());
    
    if (channel) {
      msgs = msgs.filter(m => m.channel === channel);
    }
    
    return msgs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Atualizar status de um agente
   */
  updateAgentStatus(agentId, status, currentTask = null) {
    if (this.agents.has(agentId)) {
      const agent = this.agents.get(agentId);
      agent.status = status;
      agent.lastSeen = new Date().toISOString();
      if (currentTask) {
        agent.currentTask = currentTask;
      }
      
      this.emit('agent:statusChanged', { agentId, status, currentTask });
    }
  }

  /**
   * Validar formato da mensagem
   */
  validateMessage(msg) {
    return (
      msg.from &&
      msg.to &&
      msg.type &&
      ['REQUEST', 'RESPONSE', 'EVENT'].includes(msg.type) &&
      msg.payload !== undefined
    );
  }

  /**
   * Persistir mensagem em disco
   */
  persistMessage(msg) {
    const filePath = path.join(
      this.options.persistenceDir,
      `${msg.channel}-${Date.now()}.json`
    );
    fs.writeFileSync(filePath, JSON.stringify(msg, null, 2));
  }

  /**
   * Limpeza de mensagens antigas
   */
  cleanup() {
    const cutoff = Date.now() - this.options.retentionTime;
    let removed = 0;
    
    for (const [id, msg] of this.messages) {
      if (new Date(msg.timestamp).getTime() < cutoff) {
        this.messages.delete(id);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`[MessageBus] Cleanup: removed ${removed} old messages`);
    }
  }

  /**
   * Estatísticas do message bus
   */
  getStats() {
    return {
      totalAgents: this.agents.size,
      onlineAgents: this.getOnlineAgents().length,
      totalMessages: this.messages.size,
      totalChannels: new Set(Array.from(this.messages.values()).map(m => m.channel)).size
    };
  }
}

// Singleton instance
let instance = null;

module.exports = {
  MessageBus,
  getInstance: (options) => {
    if (!instance) {
      instance = new MessageBus(options);
    }
    return instance;
  }
};
