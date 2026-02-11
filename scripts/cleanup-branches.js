#!/usr/bin/env node
/**
 * Agent Corp - Branch Cleanup
 * Limpa branches mergeadas automaticamente
 */

const { execSync } = require('child_process');

const Logger = {
  info: (msg) => console.log(`[${new Date().toISOString().slice(11,19)}] 🧹 ${msg}`),
  success: (msg) => console.log(`[${new Date().toISOString().slice(11,19)}] ✅ ${msg}`),
  warn: (msg) => console.log(`[${new Date().toISOString().slice(11,19)}] ⚠️  ${msg}`)
};

function cleanupBranches() {
  try {
    // Ir para dev
    execSync('git checkout dev', { stdio: 'pipe' });
    execSync('git pull origin dev', { stdio: 'pipe' });
    
    // Fetch com prune para atualizar refs
    execSync('git fetch --prune', { stdio: 'pipe' });
    
    // Listar branches locais mergeadas
    const output = execSync('git branch --merged dev --format="%(refname:short)" 2>/dev/null || echo ""', {
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();
    
    if (!output) {
      Logger.info('Nenhuma branch para limpar');
      return 0;
    }
    
    const branches = output.split('\n').filter(b => b && b !== 'dev' && b !== 'main' && !b.startsWith('*'));
    
    let deleted = 0;
    
    for (const branch of branches) {
      if (branch.startsWith('feature/cron-improvement-')) {
        try {
          // Deletar branch local
          execSync(`git branch -D ${branch}`, { stdio: 'pipe' });
          Logger.success(`Branch local deletada: ${branch}`);
          deleted++;
          
          // Tentar deletar no remote também
          try {
            execSync(`git push origin --delete ${branch}`, { stdio: 'pipe' });
            Logger.success(`Branch remota deletada: ${branch}`);
          } catch (e) {
            // Branch remota já pode ter sido deletada
          }
        } catch (e) {
          Logger.warn(`Erro ao deletar ${branch}: ${e.message}`);
        }
      }
    }
    
    Logger.info(`Limpeza completa: ${deleted} branches removidas`);
    return deleted;
    
  } catch (e) {
    Logger.warn(`Erro na limpeza: ${e.message}`);
    return 0;
  }
}

// Executar
const deleted = cleanupBranches();
process.exit(deleted >= 0 ? 0 : 1);
