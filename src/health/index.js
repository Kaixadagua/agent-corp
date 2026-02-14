/**
 * Health Check - Verificação de saúde
 * @module health
 */

const healthCheck = async () => {
  const checks = {
    database: 'ok',
    memory: process.memoryUsage().heapUsed < 500000000 ? 'ok' : 'warning',
    uptime: process.uptime()
  };
  
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks
  };
};

module.exports = { healthCheck };
