#!/usr/bin/env node
/**
 * Agent Corp - Orchestrator
 * Inicializador do sistema multi-agente
 */

const Director = require('./agents/director');
const CodeSpecialist = require('./agents/specialists/code');
const { getBus } = require('./shared/bus');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     🦊 AGENT CORP - SISTEMA MULTI-AGENTE                   ║');
console.log('╠════════════════════════════════════════════════════════════╣');
console.log('║                                                            ║');
console.log('║  Iniciando orquestração de agentes autônomos...           ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log();

// Inicializar Message Bus
const bus = getBus();

// Criar canal de comunicação
bus.createChannel('agent-corp-main', ['director', 'code', 'docs', 'infra', 'design']);

// Iniciar Director
const director = new Director();

// Iniciar Specialists
const specialists = [];

// Code Specialist 1
specialists.push(new CodeSpecialist('code-001'));

// Code Specialist 2 (para demonstrar múltiplos agentes do mesmo tipo)
specialists.push(new CodeSpecialist('code-002'));

console.log();
console.log('Agentes iniciados:');
console.log(`  • Director: ${director.id}`);
specialists.forEach(s => console.log(`  • Code Specialist: ${s.id}`));
console.log();

// Reportar status inicial
setTimeout(() => {
  const stats = bus.getStats();
  console.log('Status do sistema:');
  console.log(`  Total de agentes: ${stats.totalAgents}`);
  console.log(`  Por tipo:`, stats.byType);
  console.log();
  console.log('Sistema operacional. Aguardando atividades...');
}, 2000);

// Loop de status
setInterval(() => {
  const stats = bus.getStats();
  const idleAgents = Array.from(bus.agents.values())
    .filter(a => a.status === 'idle').length;
  const workingAgents = Array.from(bus.agents.values())
    .filter(a => a.status === 'working').length;
  
  console.log(`[${new Date().toLocaleTimeString()}] Status: ${idleAgents} idle, ${workingAgents} working, ${stats.totalMessages} messages`);
}, 60000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nEncerrando sistema...');
  specialists.forEach(s => bus.unregisterAgent(s.id));
  bus.unregisterAgent(director.id);
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nInterrompido pelo usuário');
  process.exit(0);
});
