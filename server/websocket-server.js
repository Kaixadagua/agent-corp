const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const REPO_PATH = '/home/lordc/.openclaw/workspace/agent-corp';
const LOG_PATH = '/tmp';

// CACHE para evitar operações repetidas
const cache = {
  git: { data: null, lastUpdate: 0 },
  files: { data: null, lastUpdate: 0 },
  tasks: { data: null, lastUpdate: 0 },
  logs: { data: null, lastUpdate: 0 }
};

const CACHE_TTL = 60000; // 1 minuto de cache

// Estado do sistema
let systemState = {
  agents: {
    jup: { status: 'active', tasks: 0, uptime: 98 },
    worker: { status: 'active', tasks: 0, uptime: 99 },
    guardian: { status: 'active', tasks: 45, uptime: 100 },
    cron: { status: 'active', tasks: 0, uptime: 99 }
  },
  tasks: { pending: 0, inProgress: 0, completed: 0 },
  pipeline: { pending: 0, progress: 0, review: 0, merged: 0 },
  activeTasks: [],
  merges: [{ branch: 'dev', status: 'merged', message: 'Branch de integração atual' }],
  metrics: { commits: 0, branches: 0, utils: 0, tests: 0, scripts: 0 },
  logs: [],
  lastUpdate: Date.now()
};

// Leitura de logs com cache
function readSystemLogs() {
  const now = Date.now();
  if (cache.logs.data && (now - cache.logs.lastUpdate) < CACHE_TTL) {
    return cache.logs.data;
  }
  
  const logs = [];
  const logFiles = ['agent-corp-cron.log', 'agent-corp-worker.log', 'agent-corp-guardian.log'];
  
  logFiles.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(LOG_PATH, file), 'utf8');
      const lines = content.split('\n').filter(l => l.trim()).slice(-3);
      lines.forEach(line => {
        const match = line.match(/\[(\d{2}:\d{2}:\d{2})\].*?(🦊|✅|⚠️|❌|✓|⚙️|🛡️|🪐|⏰)?\s*(.+)/);
        if (match) {
          logs.push({ time: match[1].substring(0, 5), icon: match[2] || '◆', message: match[3].substring(0, 40) });
        }
      });
    } catch (e) {}
  });
  
  const result = logs.slice(0, 5);
  cache.logs = { data: result, lastUpdate: now };
  return result;
}

// Métricas git com cache
function getGitMetrics() {
  const now = Date.now();
  if (cache.git.data && (now - cache.git.lastUpdate) < CACHE_TTL) {
    return cache.git.data;
  }
  
  try {
    const branches = execSync('git branch 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8', timeout: 5000 }).trim();
    const commits = execSync('git log --all --oneline --since="1 hour ago" 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8', timeout: 5000 }).trim();
    const allCommits = execSync('git log --all --oneline 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8', timeout: 5000 }).trim();
    
    const result = { branches: parseInt(branches) || 0, commits: parseInt(commits) || 0, allCommits: parseInt(allCommits) || 0 };
    cache.git = { data: result, lastUpdate: now };
    return result;
  } catch (e) { 
    return cache.git.data || { branches: 0, commits: 0, allCommits: 0 };
  }
}

// Métricas de arquivos com cache
function getFileMetrics() {
  const now = Date.now();
  if (cache.files.data && (now - cache.files.lastUpdate) < CACHE_TTL) {
    return cache.files.data;
  }
  
  try {
    let utils = 0, tests = 0;
    
    try {
      const utilsDir = path.join(REPO_PATH, 'src/utils');
      if (fs.existsSync(utilsDir)) {
        utils = fs.readdirSync(utilsDir).filter(f => f.endsWith('.js')).length;
      }
    } catch (e) {}
    
    try {
      const testsDir = path.join(REPO_PATH, 'tests/utils');
      if (fs.existsSync(testsDir)) {
        tests = fs.readdirSync(testsDir).filter(f => f.endsWith('.js')).length;
      }
    } catch (e) {}
    
    const result = { utils, tests, scripts: 0 };
    cache.files = { data: result, lastUpdate: now };
    return result;
  } catch (e) { 
    return cache.files.data || { utils: 0, tests: 0, scripts: 0 };
  }
}

// Tasks com cache
function getTaskMetrics() {
  const now = Date.now();
  if (cache.tasks.data && (now - cache.tasks.lastUpdate) < CACHE_TTL) {
    return cache.tasks.data;
  }
  
  try {
    let pending = 0, completed = 0;
    
    try {
      const pendingDir = path.join(REPO_PATH, 'memory/improvements');
      if (fs.existsSync(pendingDir)) {
        pending = fs.readdirSync(pendingDir).filter(f => f.endsWith('.md')).length;
      }
    } catch (e) {}
    
    try {
      const completedDir = path.join(REPO_PATH, 'memory/improvements/completed');
      if (fs.existsSync(completedDir)) {
        completed = fs.readdirSync(completedDir).filter(f => f.endsWith('.md')).length;
      }
    } catch (e) {}
    
    const result = { pending, completed, inProgress: 0 };
    cache.tasks = { data: result, lastUpdate: now };
    return result;
  } catch (e) { 
    return cache.tasks.data || { pending: 0, completed: 0, inProgress: 0 };
  }
}

// Atualizar estado com dados reais (otimizado)
function updateRealMetrics() {
  try {
    const now = Date.now();
    
    // Só atualiza se passou tempo suficiente (evita sobrecarga)
    if ((now - systemState.lastUpdate) < 5000) {
      return systemState;
    }
    
    const git = getGitMetrics();
    const files = getFileMetrics();
    const tasks = getTaskMetrics();
    const logs = readSystemLogs();
    
    systemState = {
      agents: {
        jup: { status: 'active', tasks: tasks.completed + tasks.pending, uptime: 98 },
        worker: { status: 'active', tasks: git.commits || 0, uptime: 99 },
        guardian: { status: 'active', tasks: 45, uptime: 100 },
        cron: { status: 'active', tasks: git.allCommits || 0, uptime: 99 }
      },
      tasks: { 
        pending: tasks.pending, 
        inProgress: 0, 
        completed: tasks.completed 
      },
      pipeline: { 
        pending: tasks.pending, 
        progress: 0, 
        review: Math.max(0, (git.branches || 0) - 1), 
        merged: tasks.completed 
      },
      activeTasks: [],
      merges: [{ branch: 'dev', status: 'merged', message: 'Branch de integração atual' }],
      metrics: { 
        commits: git.commits || 0, 
        branches: git.branches || 0, 
        utils: files.utils, 
        tests: files.tests, 
        scripts: 0 
      },
      logs: logs.length > 0 ? logs : [{ 
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), 
        icon: '🦊', 
        message: 'Sistema operacional' 
      }],
      lastUpdate: now
    };
  } catch (e) {
    console.error('[WS] Erro:', e.message);
  }
  
  return systemState;
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') { 
    res.writeHead(200); 
    res.end(); 
    return; 
  }
  
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }
  
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updateRealMetrics()));
    return;
  }
  
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

// WebSocket Server
const wss = new WebSocket.Server({ server });
const clients = new Set();
let clientCount = 0;

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try { 
        client.send(message); 
      } catch (e) {
        clients.delete(client);
      }
    }
  });
}

// Atualização em tempo real (a cada 10 segundos - reduzido para economizar recursos)
const updateInterval = setInterval(() => {
  try {
    const data = updateRealMetrics();
    broadcast({ type: 'update', data: data, timestamp: new Date().toISOString() });
  } catch (e) { 
    console.error('[WS] Erro broadcast:', e.message); 
  }
}, 10000);

// Limpar clients inativos a cada 5 minutos
const cleanupInterval = setInterval(() => {
  console.log(`[WS] Clients ativos: ${clients.size}`);
  for (const client of clients) {
    if (client.readyState !== WebSocket.OPEN) {
      clients.delete(client);
    }
  }
}, 300000);

wss.on('connection', (ws, req) => {
  clientCount++;
  const clientId = clientCount;
  console.log(`[WS] Cliente #${clientId} conectado`);
  clients.add(ws);
  
  try {
    ws.send(JSON.stringify({ 
      type: 'init', 
      data: updateRealMetrics(), 
      timestamp: new Date().toISOString() 
    }));
  } catch (e) { 
    console.error(`[WS] Erro init #${clientId}:`, e.message); 
  }
  
  ws.on('close', () => {
    console.log(`[WS] Cliente #${clientId} desconectado`);
    clients.delete(ws);
  });
  
  ws.on('error', (err) => {
    console.error(`[WS] Erro cliente #${clientId}:`, err.message);
    clients.delete(ws);
  });
});

// Iniciar
const PORT = 8081;
server.listen(PORT, 'localhost', () => {
  console.log(`[Agent Corp] WebSocket ws://localhost:${PORT}`);
  console.log(`[Agent Corp] Otimizado - updates a cada 10s, cache 1min`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Agent Corp] Encerrando...');
  clearInterval(updateInterval);
  clearInterval(cleanupInterval);
  wss.close(() => { server.close(() => { process.exit(0); }); });
});

process.on('SIGINT', () => {
  console.log('[Agent Corp] Interrompido');
  clearInterval(updateInterval);
  clearInterval(cleanupInterval);
  process.exit(0);
});

// Erros não capturados - log mas não crash
process.on('uncaughtException', (err) => {
  console.error('[Agent Corp] Erro:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Agent Corp] Promise:', reason);
});
