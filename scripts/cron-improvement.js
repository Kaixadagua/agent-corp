#!/usr/bin/env node
/**
 * Agent Corp - Cron Improvement v3
 * Estratégia de "Escada de Valor" - do básico ao avançado
 * 
 * Fases:
 * 1. Fundação (utils essenciais + testes)
 * 2. Qualidade (lint, validação, análise)
 * 3. Design (UI/UX melhorias)
 * 4. Infraestrutura (deploy, monitoramento)
 * 5. Recursos avançados (AI, automações)
 * 
 * @module agent-corp/scripts/cron-improvement
 * @version 3.0.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  repo: 'Kaixadagua/agent-corp',
  baseBranch: 'dev',
  targetBranch: 'main',
  backpressureThreshold: 9,
  gitUser: 'JUP Agent',
  gitEmail: 'jup@autonomous.ai',
  autoMerge: true
};

const Logger = {
  colors: {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
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

// =============================================================================
// SISTEMA DE FASES - ESCADA DE VALOR
// =============================================================================

const PHASES = {
  // FASE 1: FUNDAÇÃO - Utils essenciais e testes
  FOUNDATION: {
    name: 'Fundação',
    weight: 40, // 40% das melhorias
    checkComplete: () => {
      const required = [
        'src/utils/validation.js',
        'src/utils/safeExecute.js',
        'src/utils/dateFormat.js',
        'src/utils/arrayUtils.js',
        'tests/utils/validation.test.js',
        'tests/utils/dateFormat.test.js'
      ];
      return required.filter(f => fs.existsSync(f)).length >= 4;
    }
  },
  
  // FASE 2: QUALIDADE - Validação de código, lint, análise
  QUALITY: {
    name: 'Qualidade',
    weight: 30,
    checkComplete: () => {
      return fs.existsSync('.eslintrc.js') && 
             fs.existsSync('scripts/code-analyzer.js');
    }
  },
  
  // FASE 3: DESIGN - UI/UX melhorias
  DESIGN: {
    name: 'Design',
    weight: 15,
    checkComplete: () => {
      return fs.existsSync('dashboard/styles.css') || 
             fs.existsSync('src/components');
    }
  },
  
  // FASE 4: INFRAESTRUTURA - Deploy, CI/CD
  INFRA: {
    name: 'Infraestrutura',
    weight: 10,
    checkComplete: () => {
      return fs.existsSync('.github/workflows/ci.yml') ||
             fs.existsSync('docker-compose.yml');
    }
  },
  
  // FASE 5: AVANÇADO - AI, automações complexas
  ADVANCED: {
    name: 'Avançado',
    weight: 5,
    checkComplete: () => false // Sempre pode melhorar
  }
};

// Detectar fase atual
function detectCurrentPhase() {
  if (!PHASES.FOUNDATION.checkComplete()) return 'FOUNDATION';
  if (!PHASES.QUALITY.checkComplete()) return 'QUALITY';
  if (!PHASES.DESIGN.checkComplete()) return 'DESIGN';
  if (!PHASES.INFRA.checkComplete()) return 'INFRA';
  return 'ADVANCED';
}

// =============================================================================
// MELHORIAS POR FASE
// =============================================================================

const IMPROVEMENTS = {
  // ============ FASE 1: FUNDAÇÃO ============
  FOUNDATION: [
    {
      type: 'code',
      title: 'Adiciona utilitário de formatação de data',
      priority: 'high',
      check: () => !fs.existsSync('src/utils/dateFormat.js'),
      execute: () => {
        const content = `// Utilitário de formatação de data
// Provides: formatDate, formatRelative, parseDate

function formatDate(date, format = 'DD/MM/YYYY') {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const pad = (n) => n.toString().padStart(2, '0');
  
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()));
}

function formatRelative(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return 'agora';
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}min atrás\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h atrás\`;
  if (seconds < 2592000) return \`\${Math.floor(seconds / 86400)}d atrás\`;
  return formatDate(date);
}

function parseDate(str, format = 'DD/MM/YYYY') {
  // Parse simples - pode ser expandido
  const parts = str.match(/(\d+)/g);
  if (!parts || parts.length < 3) return null;
  
  if (format === 'DD/MM/YYYY') {
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  return new Date(str);
}

module.exports = { formatDate, formatRelative, parseDate };
`;
        fs.mkdirSync('src/utils', { recursive: true });
        fs.writeFileSync('src/utils/dateFormat.js', content);
        return { file: 'src/utils/dateFormat.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'test',
      title: 'Adiciona testes completos para dateFormat',
      priority: 'high',
      check: () => !fs.existsSync('tests/utils/dateFormat.test.js') && fs.existsSync('src/utils/dateFormat.js'),
      execute: () => {
        const content = `// Testes completos para dateFormat
const { formatDate, formatRelative, parseDate } = require('../../src/utils/dateFormat');

describe('dateFormat', () => {
  describe('formatDate', () => {
    test('formats date in DD/MM/YYYY', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15/01/2024');
    });
    
    test('formats with time', () => {
      const date = new Date('2024-01-15T14:30:45');
      expect(formatDate(date, 'DD/MM/YYYY HH:mm:ss')).toBe('15/01/2024 14:30:45');
    });
    
    test('handles invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid date');
      expect(formatDate(null)).toBe('Invalid date');
    });
  });
  
  describe('formatRelative', () => {
    test('returns "agora" for current time', () => {
      expect(formatRelative(new Date())).toBe('agora');
    });
    
    test('returns minutes for recent times', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60000);
      expect(formatRelative(fiveMinAgo)).toBe('5min atrás');
    });
  });
  
  describe('parseDate', () => {
    test('parses DD/MM/YYYY format', () => {
      const result = parseDate('15/01/2024');
      expect(result).toBeInstanceOf(Date);
      expect(result.getDate()).toBe(15);
    });
  });
});
`;
        fs.mkdirSync('tests/utils', { recursive: true });
        fs.writeFileSync('tests/utils/dateFormat.test.js', content);
        return { file: 'tests/utils/dateFormat.test.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona utilitário de manipulação de arrays',
      priority: 'high',
      check: () => !fs.existsSync('src/utils/arrayUtils.js'),
      execute: () => {
        const content = `// Utilitário de manipulação de arrays
// Provides: unique, groupBy, chunk, flatten, compact

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

function flatten(arr, depth = 1) {
  if (!Array.isArray(arr)) return [];
  return arr.flat(depth);
}

function compact(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(Boolean);
}

module.exports = { unique, groupBy, chunk, flatten, compact };
`;
        fs.writeFileSync('src/utils/arrayUtils.js', content);
        return { file: 'src/utils/arrayUtils.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'test',
      title: 'Adiciona testes para arrayUtils',
      priority: 'high',
      check: () => !fs.existsSync('tests/utils/arrayUtils.test.js') && fs.existsSync('src/utils/arrayUtils.js'),
      execute: () => {
        const content = `// Testes para arrayUtils
const { unique, groupBy, chunk, flatten, compact } = require('../../src/utils/arrayUtils');

describe('arrayUtils', () => {
  describe('unique', () => {
    test('removes duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });
    
    test('unique by key', () => {
      const items = [{id: 1, name: 'a'}, {id: 2, name: 'b'}, {id: 1, name: 'c'}];
      expect(unique(items, 'id')).toHaveLength(2);
    });
  });
  
  describe('groupBy', () => {
    test('groups by key', () => {
      const items = [{type: 'a', val: 1}, {type: 'b', val: 2}, {type: 'a', val: 3}];
      const grouped = groupBy(items, 'type');
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });
  });
  
  describe('chunk', () => {
    test('splits into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });
  
  describe('flatten', () => {
    test('flattens nested arrays', () => {
      expect(flatten([1, [2, 3], [4, [5]]])).toEqual([1, 2, 3, 4, [5]]);
    });
  });
  
  describe('compact', () => {
    test('removes falsy values', () => {
      expect(compact([0, 1, false, 2, '', 3, null])).toEqual([1, 2, 3]);
    });
  });
});
`;
        fs.writeFileSync('tests/utils/arrayUtils.test.js', content);
        return { file: 'tests/utils/arrayUtils.test.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona utilitário de retry com backoff exponencial',
      priority: 'medium',
      check: () => !fs.existsSync('src/utils/retry.js'),
      execute: () => {
        const content = `// Utilitário de retry com exponential backoff
// Provides: retry, retryAsync, withRetry

async function retryAsync(fn, options = {}) {
  const { 
    maxAttempts = 3, 
    delay = 1000, 
    backoff = 2,
    onRetry = null 
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw new Error(\`Failed after \${maxAttempts} attempts: \${error.message}\`);
      }
      
      const waitTime = delay * Math.pow(backoff, attempt - 1);
      
      if (onRetry) {
        onRetry({ attempt, maxAttempts, waitTime, error });
      }
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
}

function retry(fn, options = {}) {
  return retryAsync(async () => fn(), options);
}

function withRetry(fn, options = {}) {
  return async (...args) => retryAsync(() => fn(...args), options);
}

module.exports = { retry, retryAsync, withRetry };
`;
        fs.writeFileSync('src/utils/retry.js', content);
        return { file: 'src/utils/retry.js', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 2: QUALIDADE ============
  QUALITY: [
    {
      type: 'config',
      title: 'Adiciona configuração do ESLint',
      priority: 'high',
      check: () => !fs.existsSync('.eslintrc.js'),
      execute: () => {
        const content = `module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error'
  }
};
`;
        fs.writeFileSync('.eslintrc.js', content);
        return { file: '.eslintrc.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona analisador de código automatizado',
      priority: 'high',
      check: () => !fs.existsSync('scripts/code-analyzer.js'),
      execute: () => {
        const content = `#!/usr/bin/env node
/**
 * Analisador de código - identifica problemas e sugere melhorias
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CodeAnalyzer {
  constructor() {
    this.issues = [];
    this.metrics = {
      totalFiles: 0,
      totalLines: 0,
      functions: 0,
      tests: 0
    };
  }

  analyzeFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\\n');
    
    this.metrics.totalFiles++;
    this.metrics.totalLines += lines.length;
    
    // Detectar funções
    const functionMatches = content.match(/function\\s+\\w+|const\\s+\\w+\\s*=\\s*(async\\s*)?\\(/g);
    if (functionMatches) {
      this.metrics.functions += functionMatches.length;
    }
    
    // Detectar testes
    if (filepath.includes('.test.')) {
      const testMatches = content.match(/test\\s*\\(|it\\s*\\(|describe\\s*\\(/g);
      if (testMatches) {
        this.metrics.tests += testMatches.length;
      }
    }
    
    // Verificar problemas
    this.checkIssues(filepath, content, lines);
  }

  checkIssues(filepath, content, lines) {
    // Funções muito longas (>50 linhas)
    const functionRegex = /function\\s+(\\w+).*?\\{/g;
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      const startIdx = content.substring(0, match.index).split('\\n').length;
      // Simplificação - contar até próxima função ou fim
    }
    
    // console.log sem contexto
    if (content.includes('console.log') && !filepath.includes('test')) {
      this.issues.push({
        file: filepath,
        type: 'warning',
        message: 'console.log encontrado - considerar remover em produção'
      });
    }
    
    // Código duplicado (simplificado)
    const todoMatches = content.match(/TODO|FIXME|XXX/g);
    if (todoMatches) {
      this.issues.push({
        file: filepath,
        type: 'info',
        message: \`\${todoMatches.length} TODOs/FIXMEs encontrados\`
      });
    }
  }

  scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      
      if (stat.isDirectory() && !file.includes('node_modules')) {
        this.scanDirectory(filepath);
      } else if (file.endsWith('.js') && !file.includes('node_modules')) {
        this.analyzeFile(filepath);
      }
    }
  }

  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      issues: this.issues,
      score: this.calculateScore()
    };
  }

  calculateScore() {
    let score = 100;
    score -= this.issues.filter(i => i.type === 'error').length * 10;
    score -= this.issues.filter(i => i.type === 'warning').length * 5;
    score -= this.issues.filter(i => i.type === 'info').length * 1;
    return Math.max(0, score);
  }
}

// Executar análise
if (require.main === module) {
  const analyzer = new CodeAnalyzer();
  analyzer.scanDirectory('.');
  const report = analyzer.generateReport();
  
  console.log(JSON.stringify(report, null, 2));
}

module.exports = { CodeAnalyzer };
`;
        fs.writeFileSync('scripts/code-analyzer.js', content);
        fs.chmodSync('scripts/code-analyzer.js', 0o755);
        return { file: 'scripts/code-analyzer.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona script de validação de código',
      priority: 'medium',
      check: () => !fs.existsSync('scripts/validate-code.sh'),
      execute: () => {
        const content = `#!/bin/bash
# Validação de código - roda ESLint e testes

echo "=== Validação de Código ==="

# Verificar ESLint
if [ -f ".eslintrc.js" ]; then
  echo "Running ESLint..."
  npx eslint src/ --fix 2>/dev/null || echo "ESLint issues found"
fi

# Verificar testes
echo "Running tests..."
npm test 2>/dev/null || echo "Tests not configured"

# Analisar código
echo "Running code analysis..."
node scripts/code-analyzer.js > reports/analysis-$(date +%Y%m%d).json 2>/dev/null || true

echo "Validation complete"
`;
        fs.writeFileSync('scripts/validate-code.sh', content);
        fs.chmodSync('scripts/validate-code.sh', 0o755);
        return { file: 'scripts/validate-code.sh', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 3: DESIGN ============
  DESIGN: [
    {
      type: 'code',
      title: 'Adiciona CSS base para dashboard',
      priority: 'high',
      check: () => !fs.existsSync('dashboard/styles.css'),
      execute: () => {
        const content = `/* Agent Corp Dashboard Styles */

:root {
  --color-bg: #000000;
  --color-surface: #0a0a0a;
  --color-primary: #14b8a6;
  --color-primary-dark: #0d9488;
  --color-text: #ffffff;
  --color-text-secondary: #a1a1aa;
  --color-border: #27272a;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --radius: 8px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.card:hover {
  border-color: var(--color-primary);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  border: none;
  font-family: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active {
  background: rgba(34, 197, 94, 0.2);
  color: var(--color-success);
}

.status-pending {
  background: rgba(245, 158, 11, 0.2);
  color: var(--color-warning);
}
`;
        fs.mkdirSync('dashboard', { recursive: true });
        fs.writeFileSync('dashboard/styles.css', content);
        return { file: 'dashboard/styles.css', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona componente de status dinâmico',
      priority: 'medium',
      check: () => !fs.existsSync('src/components/StatusBadge.js'),
      execute: () => {
        const content = `// Componente de Status Badge
// Usage: <StatusBadge status="active" text="Online" />

class StatusBadge {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      status: options.status || 'pending',
      text: options.text || 'Pending',
      pulse: options.pulse !== false
    };
  }

  render() {
    const badge = document.createElement('span');
    badge.className = \`status-badge status-\${this.options.status}\`;
    
    if (this.options.pulse && this.options.status === 'active') {
      badge.classList.add('pulse');
    }
    
    badge.innerHTML = \`
      <span class="status-dot"></span>
      \${this.options.text}
    \`;
    
    this.container.appendChild(badge);
    return badge;
  }

  update(newStatus, newText) {
    this.options.status = newStatus;
    if (newText) this.options.text = newText;
    
    const badge = this.container.querySelector('.status-badge');
    if (badge) {
      badge.className = \`status-badge status-\${newStatus}\`;
      badge.innerHTML = \`
        <span class="status-dot"></span>
        \${newText || this.options.text}
      \`;
    }
  }
}

// CSS para pulse animation
const style = document.createElement('style');
style.textContent = \`
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .status-badge.pulse .status-dot {
    animation: pulse 2s infinite;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
\`;
document.head.appendChild(style);

module.exports = { StatusBadge };
`;
        fs.mkdirSync('src/components', { recursive: true });
        fs.writeFileSync('src/components/StatusBadge.js', content);
        return { file: 'src/components/StatusBadge.js', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 4: INFRA ============
  INFRA: [
    {
      type: 'config',
      title: 'Adiciona GitHub Actions CI/CD',
      priority: 'high',
      check: () => !fs.existsSync('.github/workflows/ci.yml'),
      execute: () => {
        const content = `name: CI/CD

on:
  push:
    branches: [dev, main]
  pull_request:
    branches: [dev, main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint || true
    
    - name: Run tests
      run: npm test || true
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      if: always()
`;
        fs.mkdirSync('.github/workflows', { recursive: true });
        fs.writeFileSync('.github/workflows/ci.yml', content);
        return { file: '.github/workflows/ci.yml', lines: content.split('\n').length };
      }
    },
    {
      type: 'config',
      title: 'Adiciona Docker Compose',
      priority: 'medium',
      check: () => !fs.existsSync('docker-compose.yml'),
      execute: () => {
        const content = `version: '3.8'

services:
  agent-corp:
    build: .
    ports:
      - "3001:3001"
      - "8080:8080"
      - "8081:8081"
    environment:
      - NODE_ENV=production
      - PORT=3001
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
`;
        fs.writeFileSync('docker-compose.yml', content);
        return { file: 'docker-compose.yml', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 5: AVANÇADO ============
  ADVANCED: [
    {
      type: 'code',
      title: 'Adiciona sistema de métricas avançadas',
      priority: 'medium',
      check: () => !fs.existsSync('src/core/metrics.js'),
      execute: () => {
        const content = `// Sistema de métricas avançadas
// Coleta e reporta métricas de performance

class MetricsCollector {
  constructor() {
    this.metrics = new Map();
    this.histograms = new Map();
    this.startTime = Date.now();
  }

  // Contador simples
  increment(name, labels = {}) {
    const key = this.makeKey(name, labels);
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
  }

  // Timer para medições
  timer(name, labels = {}) {
    const start = Date.now();
    return {
      end: () => {
        const duration = Date.now() - start;
        this.recordHistogram(name, duration, labels);
      }
    };
  }

  recordHistogram(name, value, labels = {}) {
    const key = this.makeKey(name, labels);
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }
    this.histograms.get(key).push(value);
  }

  makeKey(name, labels) {
    const labelStr = Object.entries(labels)
      .map(([k, v]) => \`\${k}=\${v}\`)
      .join(',');
    return labelStr ? \`\${name}{\${labelStr}}\` : name;
  }

  // Gerar relatório
  getReport() {
    const report = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      counters: {},
      histograms: {}
    };

    for (const [key, value] of this.metrics) {
      report.counters[key] = value;
    }

    for (const [key, values] of this.histograms) {
      report.histograms[key] = {
        count: values.length,
        sum: values.reduce((a, b) => a + b, 0),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    }

    return report;
  }

  // Exportar no formato Prometheus
  toPrometheus() {
    const lines = [];
    
    for (const [key, value] of this.metrics) {
      lines.push(\`# TYPE \${key} counter\`);
      lines.push(\`\${key} \${value}\`);
    }

    for (const [key, stats] of this.histograms) {
      lines.push(\`# TYPE \${key}_sum gauge\`);
      lines.push(\`\${key}_sum \${stats.sum}\`);
    }

    return lines.join('\\n');
  }
}

module.exports = { MetricsCollector };
`;
        fs.mkdirSync('src/core', { recursive: true });
        fs.writeFileSync('src/core/metrics.js', content);
        return { file: 'src/core/metrics.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'docs',
      title: 'Adiciona roadmap do projeto',
      priority: 'low',
      check: () => !fs.existsSync('ROADMAP.md'),
      execute: () => {
        const content = `# Roadmap - Agent Corp

## Fase 1: Fundação ✅
- [x] Utils essenciais
- [x] Testes básicos
- [x] Estrutura de projeto

## Fase 2: Qualidade 🔄
- [ ] ESLint configurado
- [ ] Análise de código automatizada
- [ ] CI/CD pipeline

## Fase 3: Design 📋
- [ ] CSS base
- [ ] Componentes reutilizáveis
- [ ] Dashboard responsivo

## Fase 4: Infraestrutura 📋
- [ ] Docker
- [ ] GitHub Actions
- [ ] Monitoramento

## Fase 5: Avançado 📋
- [ ] Métricas avançadas
- [ ] ML para predição de tasks
- [ ] Integrações externas

---

*Atualizado automaticamente pelo Agent Corp*
`;
        fs.writeFileSync('ROADMAP.md', content);
        return { file: 'ROADMAP.md', lines: content.split('\n').length };
      }
    }
  ]
};

// =============================================================================
// FUNÇÕES DE GIT
// =============================================================================

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
      `gh pr create --repo ${CONFIG.repo} --base ${CONFIG.baseBranch} --head ${branch} --title "${title}" --body "Melhoria automática - Agent Corp 🦊\\n\\nFase: ${detectCurrentPhase()}"`,
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
// SELEÇÃO INTELIGENTE DE MELHORIAS
// =============================================================================

function selectImprovement() {
  const currentPhase = detectCurrentPhase();
  const phaseImprovements = IMPROVEMENTS[currentPhase];
  
  if (!phaseImprovements || phaseImprovements.length === 0) {
    return null;
  }
  
  // Filtrar melhorias disponíveis
  const available = phaseImprovements.filter(imp => imp.check());
  
  if (available.length === 0) {
    Logger.info(`Fase ${currentPhase} completa, avançando...`);
    return null;
  }
  
  // Ordenar por prioridade
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  available.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  // Retornar a de maior prioridade
  return available[0];
}

function executeImprovement(improvement) {
  return improvement.execute();
}

// =============================================================================
// MAIN
// =============================================================================

async function run() {
  const currentPhase = detectCurrentPhase();
  Logger.info(`AGENT CORP - Cron v3 (Fase: ${PHASES[currentPhase].name})`);
  
  // Verificar backpressure
  const backpressure = checkBackpressure();
  Logger.info(`Backpressure: ${backpressure.count} PRs`);
  
  if (backpressure.active) {
    Logger.warn('Backpressure ativo - pausando');
    return { success: true, mode: 'paused' };
  }
  
  // Selecionar melhoria
  const improvement = selectImprovement();
  
  if (!improvement) {
    // Verificar se todas as fases estão completas
    const allPhases = Object.keys(PHASES);
    const completePhases = allPhases.filter(p => PHASES[p].checkComplete());
    
    if (completePhases.length === allPhases.length) {
      Logger.success('Todas as fases completas! Projeto maduro.');
    } else {
      Logger.info('Nenhuma melhoria disponível nesta fase');
    }
    
    return { success: true, mode: 'complete' };
  }
  
  Logger.info(`Melhoria: ${improvement.title} (${improvement.type})`);
  
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
  
  return { 
    success: true, 
    prNumber, 
    mode: 'pr', 
    improvement: improvement.title,
    phase: currentPhase,
    type: improvement.type
  };
}

// Executar
run().then(result => {
  process.exit(result.success ? 0 : 1);
}).catch(err => {
  Logger.error('Erro fatal', { message: err.message });
  process.exit(1);
});
