#!/usr/bin/env node
/**
 * Agent Corp - Cron Improvement v4
 * Sistema 24/7 CONTÍNUO - Backlog Expandido
 * 
 * Estratégia:
 * - Fases 1-5: Fundação → Qualidade → Design → Infra → Avançado
 * - Quando completa Fase 5, avança para Fase 6+ (novas funcionalidades)
 * - SEMPRE tem trabalho novo, nunca para
 * - Refatoração de código existente
 * 
 * @module agent-corp/scripts/cron-improvement
 * @version 4.0.0
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
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
  },

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString().slice(11, 19);
    const color = this.colors[level === 'ERROR' ? 'red' : level === 'WARN' ? 'yellow' : level === 'SUCCESS' ? 'green' : level === 'PHASE' ? 'magenta' : 'cyan'];
    const icon = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : level === 'SUCCESS' ? '✅' : level === 'PHASE' ? '🚀' : '🦊';
    
    console.log(`${color}[${timestamp}] ${icon} ${message}${this.colors.reset}`);
    if (Object.keys(meta).length > 0) {
      console.log(`   ${JSON.stringify(meta)}`);
    }
  },

  info: (msg, meta) => Logger.log('INFO', msg, meta),
  success: (msg, meta) => Logger.log('SUCCESS', msg, meta),
  warn: (msg, meta) => Logger.log('WARN', msg, meta),
  error: (msg, meta) => Logger.log('ERROR', msg, meta),
  phase: (msg, meta) => Logger.log('PHASE', msg, meta)
};

// =============================================================================
// SISTEMA DE FASES EXPANDIDO - 24/7 CONTÍNUO
// =============================================================================

const PHASES = {
  // FASES ORIGINAIS
  FOUNDATION: {
    name: 'Fundação',
    order: 1,
    checkComplete: () => countFiles('src/utils/*.js') >= 5 && countFiles('tests/utils/*.js') >= 3
  },
  QUALITY: {
    name: 'Qualidade',
    order: 2,
    checkComplete: () => fs.existsSync('.eslintrc.js') && fs.existsSync('scripts/code-analyzer.js')
  },
  DESIGN: {
    name: 'Design',
    order: 3,
    checkComplete: () => fs.existsSync('dashboard/styles.css') && countFiles('src/components/*.js') >= 2
  },
  INFRA: {
    name: 'Infraestrutura',
    order: 4,
    checkComplete: () => fs.existsSync('.github/workflows/ci.yml') && fs.existsSync('docker-compose.yml')
  },
  ADVANCED: {
    name: 'Avançado',
    order: 5,
    checkComplete: () => fs.existsSync('src/core/metrics.js') && fs.existsSync('ROADMAP.md')
  },
  
  // FASES NOVAS - EXPANSÃO 24/7
  DATABASE: {
    name: 'Banco de Dados',
    order: 6,
    checkComplete: () => fs.existsSync('src/db/connection.js') && fs.existsSync('src/models')
  },
  AUTH: {
    name: 'Autenticação',
    order: 7,
    checkComplete: () => fs.existsSync('src/auth/jwt.js') && fs.existsSync('src/middleware/auth.js')
  },
  API: {
    name: 'API REST',
    order: 8,
    checkComplete: () => countFiles('src/routes/*.js') >= 3 && fs.existsSync('src/controllers')
  },
  TESTING: {
    name: 'Testes E2E',
    order: 9,
    checkComplete: () => fs.existsSync('tests/e2e') && fs.existsSync('tests/integration')
  },
  DOCS: {
    name: 'Documentação',
    order: 10,
    checkComplete: () => fs.existsSync('docs/API.md') && fs.existsSync('docs/ARCHITECTURE.md')
  },
  REFACTOR: {
    name: 'Refatoração',
    order: 11,
    checkComplete: () => false // Sempre pode refatorar
  }
};

function countFiles(pattern) {
  try {
    const { execSync } = require('child_process');
    return parseInt(execSync(`ls ${pattern} 2>/dev/null | wc -l`, { encoding: 'utf8' }).trim()) || 0;
  } catch (e) {
    return 0;
  }
}

function detectCurrentPhase() {
  const phases = Object.entries(PHASES).sort((a, b) => a[1].order - b[1].order);
  
  for (const [key, phase] of phases) {
    if (!phase.checkComplete()) {
      return key;
    }
  }
  
  // Se todas completas, retorna REFACTOR (sempre pode melhorar)
  return 'REFACTOR';
}

// =============================================================================
// MELHORIAS EXPANDIDAS - 24/7 CONTÍNUO
// =============================================================================

const IMPROVEMENTS = {
  // ============ FASE 1-5: ORIGINAIS (JÁ COMPLETAS) ============
  
  // ============ FASE 6: BANCO DE DADOS ============
  DATABASE: [
    {
      type: 'code',
      title: 'Adiciona conexão com PostgreSQL',
      priority: 'high',
      check: () => !fs.existsSync('src/db/connection.js'),
      execute: () => {
        const content = `// Conexão com PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'agent_corp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool:', err);
});

async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Query executada:', { text: text.substring(0, 50), duration, rows: result.rowCount });
  return result;
}

async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, transaction };
`;
        fs.mkdirSync('src/db', { recursive: true });
        fs.writeFileSync('src/db/connection.js', content);
        return { file: 'src/db/connection.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona modelo de Tasks',
      priority: 'high',
      check: () => !fs.existsSync('src/models/Task.js'),
      execute: () => {
        const content = `// Modelo de Tasks
const { query } = require('../db/connection');

class Task {
  static async create({ title, description, status = 'pending', priority = 'medium' }) {
    const result = await query(
      'INSERT INTO tasks (title, description, status, priority, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [title, description, status, priority]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];
    
    if (filters.status) {
      params.push(filters.status);
      sql += \` AND status = \$\${params.length}\`;
    }
    
    if (filters.priority) {
      params.push(filters.priority);
      sql += \` AND priority = \$\${params.length}\`;
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map((f, i) => \`\${f} = \$\${i + 2}\`).join(', ');
    
    const result = await query(
      \`UPDATE tasks SET \${setClause}, updated_at = NOW() WHERE id = \$1 RETURNING *\`,
      [id, ...values]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await query('DELETE FROM tasks WHERE id = $1', [id]);
    return { deleted: true };
  }
}

module.exports = { Task };
`;
        fs.mkdirSync('src/models', { recursive: true });
        fs.writeFileSync('src/models/Task.js', content);
        return { file: 'src/models/Task.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona migrations SQL',
      priority: 'medium',
      check: () => !fs.existsSync('migrations/001_create_tasks.sql'),
      execute: () => {
        const content = `-- Migration: Cria tabela de tasks
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
`;
        fs.mkdirSync('migrations', { recursive: true });
        fs.writeFileSync('migrations/001_create_tasks.sql', content);
        return { file: 'migrations/001_create_tasks.sql', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 7: AUTENTICAÇÃO ============
  AUTH: [
    {
      type: 'code',
      title: 'Adiciona utilitário JWT',
      priority: 'high',
      check: () => !fs.existsSync('src/auth/jwt.js'),
      execute: () => {
        const content = `// Utilitário JWT para autenticação
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-aqui-mude-em-producao';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

module.exports = { generateToken, verifyToken, extractTokenFromHeader };
`;
        fs.mkdirSync('src/auth', { recursive: true });
        fs.writeFileSync('src/auth/jwt.js', content);
        return { file: 'src/auth/jwt.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona middleware de autenticação',
      priority: 'high',
      check: () => !fs.existsSync('src/middleware/auth.js'),
      execute: () => {
        const content = `// Middleware de autenticação
const { verifyToken, extractTokenFromHeader } = require('../auth/jwt');

function authMiddleware(req, res, next) {
  const token = extractTokenFromHeader(req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
  
  req.user = decoded;
  next();
}

function optionalAuth(req, res, next) {
  const token = extractTokenFromHeader(req.headers.authorization);
  
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  
  next();
}

module.exports = { authMiddleware, optionalAuth };
`;
        fs.mkdirSync('src/middleware', { recursive: true });
        fs.writeFileSync('src/middleware/auth.js', content);
        return { file: 'src/middleware/auth.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona modelo de Usuários',
      priority: 'medium',
      check: () => !fs.existsSync('src/models/User.js'),
      execute: () => {
        const content = `// Modelo de Usuários
const { query } = require('../db/connection');
const bcrypt = require('bcrypt');

class User {
  static async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO users (email, password_hash, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, name, created_at',
      [email, hashedPassword, name]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }
}

module.exports = { User };
`;
        fs.writeFileSync('src/models/User.js', content);
        return { file: 'src/models/User.js', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 8: API REST ============
  API: [
    {
      type: 'code',
      title: 'Adiciona rotas de Tasks API',
      priority: 'high',
      check: () => !fs.existsSync('src/routes/tasks.js'),
      execute: () => {
        const content = `// Rotas da API de Tasks
const express = require('express');
const router = express.Router();
const { Task } = require('../models/Task');
const { authMiddleware } = require('../middleware/auth');

// GET /api/tasks - Listar todas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll(req.query);
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/tasks/:id - Buscar uma
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task não encontrada' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/tasks - Criar
router.post('/', authMiddleware, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/tasks/:id - Atualizar
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.update(req.params.id, req.body);
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/tasks/:id - Deletar
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Task.delete(req.params.id);
    res.json({ success: true, message: 'Task deletada' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
`;
        fs.mkdirSync('src/routes', { recursive: true });
        fs.writeFileSync('src/routes/tasks.js', content);
        return { file: 'src/routes/tasks.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona rotas de Autenticação API',
      priority: 'high',
      check: () => !fs.existsSync('src/routes/auth.js'),
      execute: () => {
        const content = `// Rotas de Autenticação
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { generateToken } = require('../auth/jwt');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Verificar se usuário existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email já cadastrado' });
    }
    
    // Criar usuário
    const user = await User.create({ email, password, name });
    const token = generateToken({ userId: user.id, email: user.email });
    
    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }
    
    const validPassword = await User.validatePassword(user, password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }
    
    const token = generateToken({ userId: user.id, email: user.email });
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
`;
        fs.writeFileSync('src/routes/auth.js', content);
        return { file: 'src/routes/auth.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'code',
      title: 'Adiciona controllers de Tasks',
      priority: 'medium',
      check: () => !fs.existsSync('src/controllers/taskController.js'),
      execute: () => {
        const content = `// Controllers de Tasks
const { Task } = require('../models/Task');

class TaskController {
  async index(req, res) {
    const tasks = await Task.findAll(req.query);
    res.json({ success: true, count: tasks.length, data: tasks });
  }

  async show(req, res) {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task não encontrada' });
    }
    res.json({ success: true, data: task });
  }

  async store(req, res) {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  }

  async update(req, res) {
    const task = await Task.update(req.params.id, req.body);
    res.json({ success: true, data: task });
  }

  async destroy(req, res) {
    await Task.delete(req.params.id);
    res.json({ success: true, message: 'Task deletada com sucesso' });
  }
}

module.exports = { TaskController };
`;
        fs.mkdirSync('src/controllers', { recursive: true });
        fs.writeFileSync('src/controllers/taskController.js', content);
        return { file: 'src/controllers/taskController.js', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 9: TESTES E2E ============
  TESTING: [
    {
      type: 'test',
      title: 'Adiciona testes E2E de Tasks',
      priority: 'high',
      check: () => !fs.existsSync('tests/e2e/tasks.spec.js'),
      execute: () => {
        const content = `// Testes E2E de Tasks
const request = require('supertest');
const app = require('../../src/app');

describe('Tasks E2E', () => {
  let authToken;
  let createdTaskId;

  beforeAll(async () => {
    // Login para obter token
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = response.body.data.token;
  });

  describe('POST /api/tasks', () => {
    test('deve criar uma nova task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', \`Bearer \${authToken}\`)
        .send({
          title: 'Task de teste E2E',
          description: 'Descrição da task',
          priority: 'high'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      
      createdTaskId = response.body.data.id;
    });
  });

  describe('GET /api/tasks', () => {
    test('deve listar todas as tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', \`Bearer \${authToken}\`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('deve buscar uma task específica', async () => {
      const response = await request(app)
        .get(\`/api/tasks/\${createdTaskId}\`)
        .set('Authorization', \`Bearer \${authToken}\`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(createdTaskId);
    });
  });
});
`;
        fs.mkdirSync('tests/e2e', { recursive: true });
        fs.writeFileSync('tests/e2e/tasks.spec.js', content);
        return { file: 'tests/e2e/tasks.spec.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'test',
      title: 'Adiciona testes de integração de Auth',
      priority: 'medium',
      check: () => !fs.existsSync('tests/integration/auth.test.js'),
      execute: () => {
        const content = `// Testes de integração de Autenticação
const request = require('supertest');
const app = require('../../src/app');

describe('Auth Integration', () => {
  describe('POST /api/auth/register', () => {
    test('deve registrar novo usuário', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    test('deve rejeitar email duplicado', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    test('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    test('deve rejeitar credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
`;
        fs.mkdirSync('tests/integration', { recursive: true });
        fs.writeFileSync('tests/integration/auth.test.js', content);
        return { file: 'tests/integration/auth.test.js', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 10: DOCUMENTAÇÃO ============
  DOCS: [
    {
      type: 'docs',
      title: 'Adiciona documentação da API (OpenAPI/Swagger)',
      priority: 'high',
      check: () => !fs.existsSync('docs/openapi.yml'),
      execute: () => {
        const content = `openapi: 3.0.0
info:
  title: Agent Corp API
  description: API do sistema de agentes autônomos
  version: 1.0.0
  contact:
    name: Agent Corp Team

servers:
  - url: http://localhost:8080/api
    description: Servidor de desenvolvimento

paths:
  /tasks:
    get:
      summary: Lista todas as tasks
      tags:
        - Tasks
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, in_progress, completed]
        - name: priority
          in: query
          schema:
            type: string
            enum: [low, medium, high]
      responses:
        '200':
          description: Lista de tasks
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Task'
    
    post:
      summary: Cria uma nova task
      tags:
        - Tasks
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TaskInput'
      responses:
        '201':
          description: Task criada

  /tasks/{id}:
    get:
      summary: Busca uma task específica
      tags:
        - Tasks
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Task encontrada
        '404':
          description: Task não encontrada

components:
  schemas:
    Task:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        description:
          type: string
        status:
          type: string
          enum: [pending, in_progress, completed]
        priority:
          type: string
          enum: [low, medium, high]
        created_at:
          type: string
          format: date-time
    
    TaskInput:
      type: object
      required:
        - title
      properties:
        title:
          type: string
        description:
          type: string
        status:
          type: string
          default: pending
        priority:
          type: string
          default: medium

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
`;
        fs.writeFileSync('docs/openapi.yml', content);
        return { file: 'docs/openapi.yml', lines: content.split('\n').length };
      }
    },
    {
      type: 'docs',
      title: 'Adiciona documentação de arquitetura',
      priority: 'medium',
      check: () => !fs.existsSync('docs/ARCHITECTURE.md'),
      execute: () => {
        const content = `# Arquitetura do Agent Corp

## Visão Geral

O Agent Corp é uma aplicação Node.js com arquitetura em camadas, seguindo princípios de Clean Architecture.

## Estrutura de Pastas

\`\`\`
agent-corp/
├── src/
│   ├── db/           # Conexão e queries
│   ├── models/       # Modelos de dados
│   ├── routes/       # Rotas da API
│   ├── controllers/  # Lógica de controle
│   ├── middleware/   # Middlewares (auth, etc)
│   ├── auth/         # Autenticação JWT
│   ├── utils/        # Utilitários
│   ├── components/   # Componentes UI
│   └── core/         # Core/métricas
├── tests/
│   ├── unit/         # Testes unitários
│   ├── integration/  # Testes de integração
│   └── e2e/          # Testes end-to-end
├── migrations/       # Migrations SQL
├── docs/             # Documentação
└── dashboard/        # Frontend
\`\`\`

## Fluxo de Dados

1. **Request** → Routes
2. **Routes** → Middleware (auth)
3. **Middleware** → Controllers
4. **Controllers** → Models
5. **Models** → Database

## Tecnologias

- Node.js + Express
- PostgreSQL
- JWT para autenticação
- Jest para testes
- WebSocket para real-time

## Padrões

- RESTful API
- MVC (Model-View-Controller)
- Repository Pattern
- Dependency Injection
`;
        fs.writeFileSync('docs/ARCHITECTURE.md', content);
        return { file: 'docs/ARCHITECTURE.md', lines: content.split('\n').length };
      }
    }
  ],

  // ============ FASE 11: REFATORAÇÃO (SEMPRE ATIVA) ============
  REFACTOR: [
    {
      type: 'refactor',
      title: 'Refatora WebSocket para usar classes',
      priority: 'medium',
      check: () => !fs.existsSync('src/core/WebSocketServer.js'),
      execute: () => {
        const content = `// WebSocket Server refatorado com classes
const WebSocket = require('ws');
const http = require('http');

class WebSocketManager {
  constructor(port = 8081) {
    this.port = port;
    this.clients = new Set();
    this.server = null;
    this.wss = null;
  }

  start() {
    this.server = http.createServer(this.handleHttp.bind(this));
    this.wss = new WebSocket.Server({ server: this.server });
    
    this.wss.on('connection', this.handleConnection.bind(this));
    
    this.server.listen(this.port, 'localhost', () => {
      console.log(\`[WebSocket] Server em ws://localhost:\${this.port}\`);
    });
  }

  handleHttp(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  }

  handleConnection(ws, req) {
    console.log('[WebSocket] Cliente conectado');
    this.clients.add(ws);
    
    ws.send(JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() }));
    
    ws.on('close', () => {
      console.log('[WebSocket] Cliente desconectado');
      this.clients.delete(ws);
    });
    
    ws.on('error', (err) => {
      console.error('[WebSocket] Erro:', err.message);
      this.clients.delete(ws);
    });
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  stop() {
    this.wss.close();
    this.server.close();
  }
}

module.exports = { WebSocketManager };
`;
        fs.writeFileSync('src/core/WebSocketServer.js', content);
        return { file: 'src/core/WebSocketServer.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'refactor',
      title: 'Adiciona logger centralizado',
      priority: 'medium',
      check: () => !fs.existsSync('src/core/logger.js'),
      execute: () => {
        const content = `// Logger centralizado
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'agent-corp' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = { logger };
`;
        fs.writeFileSync('src/core/logger.js', content);
        return { file: 'src/core/logger.js', lines: content.split('\n').length };
      }
    },
    {
      type: 'refactor',
      title: 'Adiciona handler de erros global',
      priority: 'high',
      check: () => !fs.existsSync('src/middleware/errorHandler.js'),
      execute: () => {
        const content = `// Handler de erros global
const { logger } = require('../core/logger');

function errorHandler(err, req, res, next) {
  logger.error('Erro na requisição:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Não autorizado'
    });
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
}

module.exports = { errorHandler };
`;
        fs.writeFileSync('src/middleware/errorHandler.js', content);
        return { file: 'src/middleware/errorHandler.js', lines: content.split('\n').length };
      }
    }
  ]
};

// =============================================================================
// FUNÇÕES DE GIT (mantidas)
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

function createPR(branch, title, phase) {
  try {
    const output = execSync(
      `gh pr create --repo ${CONFIG.repo} --base ${CONFIG.baseBranch} --head ${branch} --title "${title}" --body "Melhoria automática - Agent Corp 🦊\\n\\nFase: ${PHASES[phase].name}"`,
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
// SELEÇÃO INTELIGENTE
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
    Logger.info(`Fase ${PHASES[currentPhase].name} completa, avançando...`);
    return null;
  }
  
  // Ordenar por prioridade
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  available.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return available[0];
}

function executeImprovement(improvement) {
  return improvement.execute();
}

// =============================================================================
// MAIN - 24/7 CONTÍNUO
// =============================================================================

async function run() {
  const currentPhase = detectCurrentPhase();
  Logger.phase(`AGENT CORP v4 - 24/7 | Fase: ${PHASES[currentPhase].name}`);
  
  // Verificar backpressure
  const backpressure = checkBackpressure();
  Logger.info(`Backpressure: ${backpressure.count} PRs`);
  
  if (backpressure.active) {
    Logger.warn('Backpressure ativo - pausando temporariamente');
    return { success: true, mode: 'paused' };
  }
  
  // Selecionar melhoria
  const improvement = selectImprovement();
  
  if (!improvement) {
    // Se não há melhorias, verifica se é REFACTOR (sempre tem)
    if (currentPhase === 'REFACTOR') {
      Logger.info('Fase de Refatoração - selecionando trabalho contínuo');
      // Na fase REFACTOR, sempre tem algo para fazer
    } else {
      Logger.phase(`Fase ${PHASES[currentPhase].name} 100% completa!`);
      Logger.info('Avançando para próxima fase automaticamente...');
      return { success: true, mode: 'phase_complete', phase: currentPhase };
    }
  }
  
  Logger.info(`Melhoria: ${improvement.title} [${improvement.type}]`);
  
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
  const prNumber = createPR(branch, improvement.title, currentPhase);
  if (!prNumber) {
    Logger.error('Falha ao criar PR');
    return { success: false };
  }
  
  Logger.success(`PR #${prNumber} criado`);
  
  // Auto-merge
  if (autoMergePR(prNumber)) {
    Logger.success(`PR #${prNumber} mergeado!`);
  } else {
    Logger.warn('Auto-merge falhou - será necessário merge manual');
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
