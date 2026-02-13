/**
 * Configurações
 * @module config
 */

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  api: {
    baseURL: process.env.API_URL || 'http://localhost:3000/api',
    timeout: 10000
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: '7d'
  }
};

module.exports = config;
