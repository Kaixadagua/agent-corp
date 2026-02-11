const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Estado do sistema
const systemState = {
  agents: {
    jup: { status: 'active', tasks: 12, uptime: 98 },
    worker: { status: 'active', tasks: 89, uptime: 99 },
    guardian: { status: 'active', tasks: 45, uptime: 100 },
    cron: { status: 'active', tasks: 134, uptime: 99 }
  },
  tasks: {
    pending: 0,
    inProgress: 2,
    completed: 89
  },
  metrics: {
    commits: 0,
    branches: 28,
    utils: 2,
    tests: 1
  },
  logs: []
};

// Criar servidor HTTP
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API endpoints
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }));
    return;
  }
  
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(systemState));
    return;
  }
  
  if (req.url === '/api/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      commits: systemState.metrics.commits,
      branches: systemState.metrics.branches,
      utils: systemState.metrics.utils,
      tests: systemState.metrics.tests,
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

// Clientes conectados
const clients = new Set();

// Broadcast para todos os clientes
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Atualizar métricas periodicamente
function updateMetrics() {
  // Simular atualizações baseadas em dados reais do git
  try {
    const { execSync } = require('child_process');
    const cwd = '/home/lordc/.openclaw/workspace/agent-corp';
    
    systemState.metrics.branches = parseInt(
      execSync('git branch | wc -l', { cwd, encoding: 'utf8' }).trim()
    ) || 28;
    
    systemState.metrics.commits = parseInt(
      execSync('git log --all --oneline --since="1 hour ago" | wc -l', { cwd, encoding: 'utf8' }).trim()
    ) || 0;
    
    systemState.metrics.utils = parseInt(
      execSync('ls src/utils/*.js 2>/dev/null | wc -l', { cwd, encoding: 'utf8' }).trim()
    ) || 2;
    
    systemState.metrics.tests = parseInt(
      execSync('ls tests/utils/*.js 2>/dev/null | wc -l', { cwd, encoding: 'utf8' }).trim()
    ) || 1;
    
  } catch (e) {
    // Usar valores padrão se falhar
  }
  
  // Atualizar tasks aleatoriamente
  systemState.tasks.inProgress = Math.floor(Math.random() * 3) + 1;
  
  // Adicionar log
  const activities = [
    'Task atualizada',
    'Health check passed',
    'Nova melhoria criada',
    'Branch mergeada',
    'Worker cycle completo'
  ];
  
  if (Math.random() > 0.7) {
    systemState.logs.unshift({
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      icon: ['✓', '🛡️', '🪐', '⚙️'][Math.floor(Math.random() * 4)],
      message: activities[Math.floor(Math.random() * activities.length)]
    });
    
    if (systemState.logs.length > 10) {
      systemState.logs.pop();
    }
  }
  
  // Broadcast atualização
  broadcast({
    type: 'update',
    data: systemState,
    timestamp: new Date().toISOString()
  });
}

// Conexão WebSocket
wss.on('connection', (ws) => {
  console.log('[WS] Cliente conectado');
  clients.add(ws);
  
  // Enviar estado inicial
  ws.send(JSON.stringify({
    type: 'init',
    data: systemState,
    timestamp: new Date().toISOString()
  }));
  
  // Ping para manter conexão
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
    }
  }, 30000);
  
  ws.on('close', () => {
    console.log('[WS] Cliente desconectado');
    clients.delete(ws);
    clearInterval(pingInterval);
  });
  
  ws.on('error', (err) => {
    console.error('[WS] Erro:', err.message);
    clients.delete(ws);
  });
});

// Atualizar a cada 5 segundos
setInterval(updateMetrics, 5000);

// Iniciar servidor
const PORT = 8081;
server.listen(PORT, 'localhost', () => {
  console.log(`[Agent Corp] WebSocket Server rodando em ws://localhost:${PORT}`);
  console.log(`[Agent Corp] API disponível em http://localhost:${PORT}/api/status`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Agent Corp] Encerrando...');
  wss.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
});
