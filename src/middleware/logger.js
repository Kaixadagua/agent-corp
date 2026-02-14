/**
 * logger Middleware
 * Processa requisições
 */

const logger = (req, res, next) => {
  console.log('[logger] Request received');
  
  // Process middleware logic
  req.timestamp = Date.now();
  
  next();
};

module.exports = logger;
