/**
 * Tratamento de Erros Global
 * Padroniza tratamento de erros na aplicação
 * 
 * @module core/errorHandler
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message
    });
  }

  // Erro não operacional (bug)
  console.error('ERROR:', err);
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: 'Erro interno do servidor'
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler
};
