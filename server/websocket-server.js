const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const REPO_PATH = '/home/lordc/.openclaw/workspace/agent-corp';
const LOG_PATH = '/tmp';

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
  logs: []
};

// Funções de coleta de dados
function readSystemLogs() {
  const logs = [];
  const logFiles = ['agent-corp-cron.log', 'agent-corp-worker.log', 'agent-corp-guardian.log', 'jup-hourly.log'];
  
  logFiles.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(LOG_PATH, file), 'utf8');
      const lines = content.split('\n').filter(l => l.trim()).slice(-5);
      lines.forEach(line => {
        const match = line.match(/\[(\d{2}:\d{2}:\d{2})\].*?(🦊|✅|⚠️|❌|✓|⚙️|🛡️|🪐|⏰)?\s*(.+)/);
        if (match) {
          logs.push({ time: match[1].substring(0, 5), icon: match[2] || '◆', message: match[3].substring(0, 50) });
        }
      });
    } catch (e) {}
  });
  
  return logs.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 10);
}

function getGitMetrics() {
  try {
    const branches = execSync('git branch 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8' }).trim();
    const commits = execSync('git log --all --oneline --since="1 hour ago" 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8' }).trim();
    const allCommits = execSync('git log --all --oneline 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8' }).trim();
    return { branches: parseInt(branches) || 0, commits: parseInt(commits) || 0, allCommits: parseInt(allCommits) || 0 };
  } catch (e) { return { branches: 0, commits: 0, allCommits: 0 }; }
}

function getFileMetrics() {
  try {
    const utils = execSync('ls src/utils/*.js 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8' }).trim();
    const tests = execSync('ls tests/utils/*.js 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8' }).trim();
    const scripts = execSync('ls scripts/*.js 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8' }).trim();
    return { utils: parseInt(utils) || 0, tests: parseInt(tests) || 0, scripts: parseInt(scripts) || 0 };
  } catch (e) { return { utils: 0, tests: 0, scripts: 0 }; }
}

function getTaskMetrics() {
  try {
    const pending = execSync('ls memory/improvements/*.md 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8' }).trim();
    const completed = execSync('ls memory/improvements/completed/*.md 2>/dev/null | wc -l', { cwd: REPO_PATH, encoding: 'utf8' }).trim();
    return { pending: parseInt(pending) || 0, completed: parseInt(completed) || 0, inProgress: 0 };
  } catch (e) { return { pending: 0, completed: 0, inProgress: 0 }; }
}

function getActiveTasks() {
  const tasks = [];
  try {
    const pendingDir = path.join(REPO_PATH, 'memory/improvements');
    if (fs.existsSync(pendingDir)) {
      const files = fs.readdirSync(pendingDir).filter(f => f.endsWith('.md'));
      files.slice(0, 3).forEach((file, idx) => {
        try {
          const content = fs.readFileSync(path.join(pendingDir, file), 'utf8');
          const title = content.match(/^#\s*(.+)/)?.[1] || file;
          tasks.push({ id: `TASK-${idx + 1}`, title: title.substring(0, 40), status: 'pending', agent: '⏳', agentName: 'Aguardando', branch: null });
        } catch (e) {}
      });
    }
    try {
      const branches = execSync('git branch 2>/dev/null | grep feature/ || echo ""', { cwd: REPO_PATH, encoding: 'utf8' }).trim().split('\n').filter(b => b.trim());
      branches.slice(0, 3).forEach((branch, idx) => {
        const cleanBranch = branch.replace('*', '').trim();
        tasks.push({ id: `TASK-${tasks.length + idx + 1}`, title: `Trabalhando em: ${cleanBranch.substring(0, 30)}`, status: 'progress', agent: '⚙️', agentName: 'Worker', branch: cleanBranch });
      });
    } catch (e) {}
  } catch (e) {}
  return tasks;
}

function updateRealMetrics() {
  try {
    const git = getGitMetrics();
    const files = getFileMetrics();
    const tasks = getTaskMetrics();
    const logs = readSystemLogs();
    const activeTasks = getActiveTasks();
    
    systemState = {
      agents: {
        jup: { status: 'active', tasks: tasks.completed + tasks.pending, uptime: 98 },
        worker: { status: 'active', tasks: git.commits, uptime: 99 },
        guardian: { status: 'active', tasks: 45, uptime: 100 },
        cron: { status: 'active', tasks: git.allCommits, uptime: 99 }
      },
      tasks: { pending: tasks.pending, inProgress: activeTasks.filter(t => t.status === 'progress').length, completed: tasks.completed },
      pipeline: { pending: tasks.pending, progress: activeTasks.filter(t => t.status === 'progress').length, review: Math.max(0, git.branches - activeTasks.filter(t => t.status === 'progress').length - 1), merged: tasks.completed },
      activeTasks: activeTasks,
      merges: [{ branch: 'dev', status: 'merged', message: 'Branch de integração atual' }],
      metrics: { commits: git.commits, branches: git.branches, utils: files.utils, tests: files.tests, scripts: files.scripts },
      logs: logs.length > 0 ? logs : [{ time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), icon: '🦊', message: 'Sistema operacional' }]
    };
  } catch (e) {
    console.error('[WS] Erro ao atualizar métricas:', e.message);
  }
  
  return systemState;
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  
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

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try { client.send(message); } catch (e) {}
    }
  });
}

// Atualização em tempo real (a cada 5 segundos)
const updateInterval = setInterval(() => {
  try {
    const data = updateRealMetrics();
    broadcast({ type: 'update', data: data, timestamp: new Date().toISOString() });
  } catch (e) { console.error('[WS] Erro no broadcast:', e.message); }
}, 5000);

wss.on('connection', (ws) => {
  console.log('[WS] Cliente conectado');
  clients.add(ws);
  
  try {
    ws.send(JSON.stringify({ type: 'init', data: updateRealMetrics(), timestamp: new Date().toISOString() }));
  } catch (e) { console.error('[WS] Erro ao enviar init:', e.message); }
  
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      try { ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() })); } catch (e) {}
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

// Iniciar
const PORT = 8081;
server.listen(PORT, 'localhost', () => {
  console.log(`[Agent Corp] WebSocket Server em ws://localhost:${PORT}`);
  console.log(`[Agent Corp] Real-time updates a cada 5s`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Agent Corp] Encerrando...');
  clearInterval(updateInterval);
  wss.close(() => { server.close(() => { process.exit(0); }); });
});

process.on('SIGINT', () => {
  console.log('[Agent Corp] Interrompido');
  clearInterval(updateInterval);
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('[Agent Corp] Erro não capturado:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Agent Corp] Promise rejeitada:', reason);
});
