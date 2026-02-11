#!/usr/bin/env node
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
    const lines = content.split('\n');
    
    this.metrics.totalFiles++;
    this.metrics.totalLines += lines.length;
    
    // Detectar funções
    const functionMatches = content.match(/function\s+\w+|const\s+\w+\s*=\s*(async\s*)?\(/g);
    if (functionMatches) {
      this.metrics.functions += functionMatches.length;
    }
    
    // Detectar testes
    if (filepath.includes('.test.')) {
      const testMatches = content.match(/test\s*\(|it\s*\(|describe\s*\(/g);
      if (testMatches) {
        this.metrics.tests += testMatches.length;
      }
    }
    
    // Verificar problemas
    this.checkIssues(filepath, content, lines);
  }

  checkIssues(filepath, content, lines) {
    // Funções muito longas (>50 linhas)
    const functionRegex = /function\s+(\w+).*?\{/g;
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      const startIdx = content.substring(0, match.index).split('\n').length;
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
        message: `${todoMatches.length} TODOs/FIXMEs encontrados`
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
