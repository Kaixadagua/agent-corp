/**
 * Logger Centralizado
 * @module core/logger
 */

const Logger = {
  info: (msg) => console.log('[INFO]', new Date().toISOString(), msg),
  error: (msg) => console.log('[ERROR]', new Date().toISOString(), msg),
  warn: (msg) => console.log('[WARN]', new Date().toISOString(), msg),
  debug: (msg) => {
    if (process.env.DEBUG) console.log('[DEBUG]', new Date().toISOString(), msg);
  }
};

module.exports = { Logger };
