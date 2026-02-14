/**
 * auth Middleware
 * Processa requisições
 */

const auth = (req, res, next) => {
  console.log('[auth] Request received');
  
  // Process middleware logic
  req.timestamp = Date.now();
  
  next();
};

module.exports = auth;
