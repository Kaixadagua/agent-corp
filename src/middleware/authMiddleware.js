/**
 * authMiddleware Middleware
 * Processa requisições HTTP
 * @module middleware/authMiddleware
 */

/**
 * Middleware para processamento de requisições
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authMiddleware = (req, res, next) => {
  // Log request info
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Add timestamp to request
  req.timestamp = Date.now();
  
  // Continue to next middleware
  next();
};

module.exports = authMiddleware;
