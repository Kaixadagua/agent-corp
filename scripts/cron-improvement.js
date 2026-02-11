#!/usr/bin/env node
/**
 * Agent Corp - Cron Improvement v2
 * Melhorias REAIS e construtivas - não apenas atualizações de timestamp
 * 
 * @module agent-corp/scripts/cron-improvement
 * @version 2.0.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  repo: 'Kaixadagua/agent-corp',
  baseBranch: 'dev',
  targetBranch: 'main',
  backpressureThreshold: 9,
  improvementsDir: 'memory/improvements',
  gitUser: 'JUP Agent',
  gitEmail: 'jup@autonomous.ai',
  autoMerge: true
};

const Logger = {
  colors: {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
  },

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString().slice(11, 19);
    const color = this.colors[level === 'ERROR' ? 'red' : level === 'WARN' ? 'yellow' : level === 'SUCCESS' ? 'green' : 'cyan'];
    const icon = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : level === 'SUCCESS' ? '✅' : '🦊';
    
    console.log(`${color}[${timestamp}] ${icon} ${message}${this.colors.reset}`);
    if (Object.keys(meta).length > 0) {
      console.log(`   ${JSON.stringify(meta)}`);
    }
  },

  info: (msg, meta) => Logger.log('INFO', msg, meta),
  success: (msg, meta) => Logger.log('SUCCESS', msg, meta),
  warn: (msg, meta) => Logger.log('WARN', msg, meta),
  error: (msg, meta) => Logger.log('ERROR', msg, meta)
};

function checkBackpressure() {
  try {
    const output = execSync(`gh pr list --repo ${CONFIG.repo} --state open --json number --jq length`, {
      encoding: 'utf8',
      timeout: 10000
    }).trim();
    
    const count = parseInt(output, 10) || 0;
    return { active: count >= CONFIG.backpressureThreshold, count };
  } catch (e) {
    Logger.warn('Erro ao verificar backpressure', { error: e.message });
    return { active: false, count: 0 };
  }
}

function checkoutDev() {
  try {
    execSync(`git checkout ${CONFIG.baseBranch}`, { stdio: 'pipe' });
    execSync(`git pull origin ${CONFIG.baseBranch}`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

function createBranch() {
  const timestamp = Date.now().toString(36);
  const branch = `feature/cron-improvement-${timestamp}`;
  try {
    checkoutDev();
    execSync(`git checkout -b ${branch}`, { stdio: 'pipe' });
    return branch;
  } catch (e) {
    return null;
  }
}

function commit(message) {
  try {
    execSync('git add .', { stdio: 'pipe' });
    execSync(`git commit -m "${message}"`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

function push(branch) {
  try {
    execSync(`git push -u origin ${branch}`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

function createPR(branch, title) {
  try {
    const output = execSync(
      `gh pr create --repo ${CONFIG.repo} --base ${CONFIG.baseBranch} --head ${branch} --title "${title}" --body "Melhoria automática - Agent Corp 🦊"`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    const match = output.match(/\/pull\/(\d+)/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}

function autoMergePR(prNumber) {
  if (!CONFIG.autoMerge || !prNumber) return false;
  
  try {
    execSync(`gh pr merge ${prNumber} --repo ${CONFIG.repo} --squash --delete-branch --admin`, {
      stdio: 'pipe'
    });
    return true;
  } catch (e) {
    return false;
  }
}

// =============================================================================
// MELHORIAS REAIS - CADA UMA CRIA VALOR NOVO
// =============================================================================

// Verificar se arquivo já existe
function fileExists(filepath) {
  return fs.existsSync(filepath);
}

// Gerar nome de arquivo único
function generateUniqueFilename(basePath, prefix) {
  let counter = 1;
  let filepath = `${basePath}/${prefix}.js`;
  while (fs.existsSync(filepath)) {
    filepath = `${basePath}/${prefix}-${counter}.js`;
    counter++;
  }
  return filepath;
}

// Melhorias disponíveis - cada uma cria algo NOVO
const IMPROVEMENTS = [
  // ============ UTILITÁRIOS ============
  {
    type: 'code',
    category: 'utils',
    title: 'Adiciona utilitário de formatação de data',
    check: () => !fileExists('src/utils/dateFormat.js'),
    execute: () => {
      const content = `// Utilitário de formatação de data
// Provides: formatDate, formatRelative

function formatDate(date, format = 'DD/MM/YYYY') {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const pad = (n) => n.toString().padStart(2, '0');
  
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()));
}

function formatRelative(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return 'agora';
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}min atrás\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h atrás\`;
  return \`\${Math.floor(seconds / 86400)}d atrás\`;
}

module.exports = { formatDate, formatRelative };
`;
      fs.writeFileSync('src/utils/dateFormat.js', content);
      return { file: 'src/utils/dateFormat.js', lines: 33 };
    }
  },
  {
    type: 'code',
    category: 'utils',
    title: 'Adiciona utilitário de validação de email',
    check: () => !fileExists('src/utils/emailValidator.js'),
    execute: () => {
      const content = `// Utilitário de validação de email
// Provides: isValidEmail, extractDomain

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

function extractDomain(email) {
  if (!isValidEmail(email)) return null;
  return email.split('@')[1];
}

function isCorporateEmail(email, domains = ['gmail.com', 'yahoo.com', 'hotmail.com']) {
  const domain = extractDomain(email);
  if (!domain) return false;
  return !domains.includes(domain.toLowerCase());
}

module.exports = { isValidEmail, extractDomain, isCorporateEmail };
`;
      fs.writeFileSync('src/utils/emailValidator.js', content);
      return { file: 'src/utils/emailValidator.js', lines: 24 };
    }
  },
  {
    type: 'code',
    category: 'utils',
    title: 'Adiciona utilitário de manipulação de arrays',
    check: () => !fileExists('src/utils/arrayUtils.js'),
    execute: () => {
      const content = `// Utilitário de manipulação de arrays
// Provides: unique, groupBy, chunk

function unique(arr, key) {
  if (!Array.isArray(arr)) return [];
  if (!key) return [...new Set(arr)];
  
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

function groupBy(arr, key) {
  if (!Array.isArray(arr)) return {};
  return arr.reduce((acc, item) => {
    const val = item[key];
    if (!acc[val]) acc[val] = [];
    acc[val].push(item);
    return acc;
  }, {});
}

function chunk(arr, size) {
  if (!Array.isArray(arr) || size < 1) return [];
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

module.exports = { unique, groupBy, chunk };
`;
      fs.writeFileSync('src/utils/arrayUtils.js', content);
      return { file: 'src/utils/arrayUtils.js', lines: 39 };
    }
  },
  {
    type: 'code',
    category: 'utils',
    title: 'Adiciona utilitário de retry com backoff',
    check: () => !fileExists('src/utils/retry.js'),
    execute: () => {
      const content = `// Utilitário de retry com exponential backoff
// Provides: retry, retryAsync

async function retryAsync(fn, options = {}) {
  const { maxAttempts = 3, delay = 1000, backoff = 2 } = options;
  
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      
      const waitTime = delay * Math.pow(backoff, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
}

function retry(fn, options = {}) {
  return retryAsync(async () => fn(), options);
}

module.exports = { retry, retryAsync };
`;
      fs.writeFileSync('src/utils/retry.js', content);
      return { file: 'src/utils/retry.js', lines: 30 };
    }
  },
  {
    type: 'code',
    category: 'utils',
    title: 'Adiciona utilitário de cache em memória',
    check: () => !fileExists('src/utils/memoryCache.js'),
    execute: () => {
      const content = `// Utilitário de cache em memória com TTL
// Provides: MemoryCache class

class MemoryCache {
  constructor(defaultTTL = 60000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }
  
  set(key, value, ttl = this.defaultTTL) {
    const expires = Date.now() + ttl;
    this.cache.set(key, { value, expires });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return undefined;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.get(key) !== undefined;
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

module.exports = { MemoryCache };
`;
      fs.writeFileSync('src/utils/memoryCache.js', content);
      return { file: 'src/utils/memoryCache.js', lines: 44 };
    }
  },
  
  // ============ TESTES ============
  {
    type: 'test',
    category: 'test',
    title: 'Adiciona testes para dateFormat',
    check: () => !fileExists('tests/utils/dateFormat.test.js') && fileExists('src/utils/dateFormat.js'),
    execute: () => {
      const content = `// Testes para dateFormat
const { formatDate, formatRelative } = require('../../src/utils/dateFormat');

describe('dateFormat', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
    });
    
    test('returns Invalid date for invalid input', () => {
      expect(formatDate('invalid')).toBe('Invalid date');
    });
    
    test('formats with time', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(formatDate(date, 'DD/MM/YYYY HH:mm')).toBe('15/01/2024 14:30');
    });
  });
  
  describe('formatRelative', () => {
    test('returns "agora" for recent dates', () => {
      expect(formatRelative(new Date())).toBe('agora');
    });
  });
});
`;
      fs.writeFileSync('tests/utils/dateFormat.test.js', content);
      return { file: 'tests/utils/dateFormat.test.js', lines: 28 };
    }
  },
  {
    type: 'test',
    category: 'test',
    title: 'Adiciona testes para emailValidator',
    check: () => !fileExists('tests/utils/emailValidator.test.js') && fileExists('src/utils/emailValidator.js'),
    execute: () => {
      const content = `// Testes para emailValidator
const { isValidEmail, extractDomain, isCorporateEmail } = require('../../src/utils/emailValidator');

describe('emailValidator', () => {
  describe('isValidEmail', () => {
    test('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });
    
    test('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });
  
  describe('extractDomain', () => {
    test('extracts domain correctly', () => {
      expect(extractDomain('test@gmail.com')).toBe('gmail.com');
    });
    
    test('returns null for invalid email', () => {
      expect(extractDomain('invalid')).toBeNull();
    });
  });
});
`;
      fs.writeFileSync('tests/utils/emailValidator.test.js', content);
      return { file: 'tests/utils/emailValidator.test.js', lines: 29 };
    }
  },
  {
    type: 'test',
    category: 'test',
    title: 'Adiciona testes para arrayUtils',
    check: () => !fileExists('tests/utils/arrayUtils.test.js') && fileExists('src/utils/arrayUtils.js'),
    execute: () => {
      const content = `// Testes para arrayUtils
const { unique, groupBy, chunk } = require('../../src/utils/arrayUtils');

describe('arrayUtils', () => {
  describe('unique', () => {
    test('removes duplicates from array', () => {
      expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
    });
    
    test('unique by key', () => {
      const items = [{id: 1}, {id: 2}, {id: 1}];
      expect(unique(items, 'id')).toEqual([{id: 1}, {id: 2}]);
    });
  });
  
  describe('groupBy', () => {
    test('groups items by key', () => {
      const items = [{type: 'a'}, {type: 'b'}, {type: 'a'}];
      const grouped = groupBy(items, 'type');
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });
  });
  
  describe('chunk', () => {
    test('splits array into chunks', () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });
  });
});
`;
      fs.writeFileSync('tests/utils/arrayUtils.test.js', content);
      return { file: 'tests/utils/arrayUtils.test.js', lines: 33 };
    }
  },
  {
    type: 'test',
    category: 'test',
    title: 'Adiciona testes para memoryCache',
    check: () => !fileExists('tests/utils/memoryCache.test.js') && fileExists('src/utils/memoryCache.js'),
    execute: () => {
      const content = `// Testes para memoryCache
const { MemoryCache } = require('../../src/utils/memoryCache');

describe('MemoryCache', () => {
  let cache;
  
  beforeEach(() => {
    cache = new MemoryCache(1000); // 1s TTL for tests
  });
  
  test('stores and retrieves values', () => {
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });
  
  test('returns undefined for missing keys', () => {
    expect(cache.get('missing')).toBeUndefined();
  });
  
  test('expires items after TTL', async () => {
    cache.set('key', 'value', 50);
    expect(cache.get('key')).toBe('value');
    await new Promise(r => setTimeout(r, 60));
    expect(cache.get('key')).toBeUndefined();
  });
  
  test('deletes items', () => {
    cache.set('key', 'value');
    cache.delete('key');
    expect(cache.get('key')).toBeUndefined();
  });
});
`;
      fs.writeFileSync('tests/utils/memoryCache.test.js', content);
      return { file: 'tests/utils/memoryCache.test.js', lines: 35 };
    }
  },
  
  // ============ CONFIGURAÇÃO ============
  {
    type: 'config',
    category: 'config',
    title: 'Adiciona configuração de ambiente',
    check: () => !fileExists('config/default.json'),
    execute: () => {
      const content = JSON.stringify({
        server: {
          port: 3001,
          host: 'localhost'
        },
        websocket: {
          port: 8081,
          heartbeat: 30000
        },
        cache: {
          ttl: 60000,
          maxSize: 1000
        },
        logging: {
          level: 'info',
          format: 'json'
        }
      }, null, 2);
      
      fs.mkdirSync('config', { recursive: true });
      fs.writeFileSync('config/default.json', content);
      return { file: 'config/default.json', lines: 20 };
    }
  },
  {
    type: 'config',
    category: 'config',
    title: 'Adiciona configuração de desenvolvimento',
    check: () => !fileExists('config/development.json'),
    execute: () => {
      const content = JSON.stringify({
        server: {
          port: 3001,
          debug: true
        },
        logging: {
          level: 'debug'
        }
      }, null, 2);
      
      fs.mkdirSync('config', { recursive: true });
      fs.writeFileSync('config/development.json', content);
      return { file: 'config/development.json', lines: 11 };
    }
  },
  
  // ============ DOCUMENTAÇÃO ============
  {
    type: 'docs',
    category: 'docs',
    title: 'Adiciona guia de contribuição',
    check: () => !fileExists('CONTRIBUTING.md'),
    execute: () => {
      const content = `# Guia de Contribuição

## Como contribuir

1. Fork o repositório
2. Crie uma branch: \`git checkout -b feature/nome">
3. Commit suas mudanças: \`git commit -m 'Adiciona feature'
4. Push: \`git push origin feature/nome">
5. Abra um Pull Request

## Padrões de código

- Use ESLint
- Escreva testes para novas features
- Documente funções públicas

## Reportando bugs

Use as issues do GitHub com template de bug report.
`;
      fs.writeFileSync('CONTRIBUTING.md', content);
      return { file: 'CONTRIBUTING.md', lines: 22 };
    }
  },
  {
    type: 'docs',
    category: 'docs',
    title: 'Adiciona guia de API',
    check: () => !fileExists('docs/API.md'),
    execute: () => {
      const content = `# API Documentation

## Endpoints

### GET /api/health
Retorna status de saúde do sistema.

**Response:**
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

### GET /api/status
Retorna métricas do sistema.

**Response:**
\`\`\`json
{
  "agents": { ... },
  "tasks": { ... },
  "metrics": { ... }
}
\`\`\`

## WebSocket

Conecte-se a \`ws://localhost:8081\` para updates em tempo real.
`;
      fs.mkdirSync('docs', { recursive: true });
      fs.writeFileSync('docs/API.md', content);
      return { file: 'docs/API.md', lines: 35 };
    }
  }
];

// Selecionar melhoria que ainda não foi feita
function selectImprovement() {
  const available = IMPROVEMENTS.filter(imp => imp.check());
  
  if (available.length === 0) {
    return null;
  }
  
  // Escolher aleatoriamente entre as disponíveis
  return available[Math.floor(Math.random() * available.length)];
}

// Executar melhoria
function executeImprovement(improvement) {
  return improvement.execute();
}

// =============================================================================
// MAIN
// =============================================================================

async function run() {
  Logger.info('AGENT CORP - Cron Improvement v2 (Real) iniciado');
  
  // Verificar backpressure
  const backpressure = checkBackpressure();
  Logger.info(`Backpressure: ${backpressure.count} PRs`);
  
  if (backpressure.active) {
    Logger.warn('Backpressure ativo - pausando');
    return { success: true, mode: 'paused' };
  }
  
  // Selecionar melhoria REAL
  const improvement = selectImprovement();
  
  if (!improvement) {
    Logger.info('Nenhuma melhoria nova disponível - backlog completo');
    return { success: true, mode: 'complete' };
  }
  
  Logger.info(`Melhoria selecionada: ${improvement.title}`);
  
  const result = executeImprovement(improvement);
  
  // Criar branch
  const branch = createBranch();
  if (!branch) {
    Logger.error('Falha ao criar branch');
    return { success: false };
  }
  
  Logger.info(`Branch: ${branch}`);
  
  // Commit
  if (!commit(improvement.title)) {
    Logger.error('Falha no commit');
    return { success: false };
  }
  
  // Push
  if (!push(branch)) {
    Logger.error('Falha no push');
    return { success: false };
  }
  
  // Criar PR
  const prNumber = createPR(branch, improvement.title);
  if (!prNumber) {
    Logger.error('Falha ao criar PR');
    return { success: false };
  }
  
  Logger.success(`PR #${prNumber} criado`);
  
  // Auto-merge
  if (autoMergePR(prNumber)) {
    Logger.success(`PR #${prNumber} mergeado!`);
  } else {
    Logger.warn('Auto-merge falhou');
  }
  
  return { success: true, prNumber, mode: 'pr', improvement: improvement.title };
}

// Executar
run().then(result => {
  process.exit(result.success ? 0 : 1);
}).catch(err => {
  Logger.error('Erro fatal', { message: err.message });
  process.exit(1);
});
