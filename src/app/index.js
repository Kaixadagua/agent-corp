/**
 * Agent Corp - Aplicação Express Integrada
 * Demonstra uso de todos os módulos criados
 * 
 * @module app
 */

const express = require('express');
const { apiClient } = require('../services/apiClient');
const { Logger } = require('../core/logger');
const { AppError, errorHandler, asyncHandler } = require('../core/errorHandler');
const config = require('../config');
const { connectDB } = require('../database');
const validators = require('../validation');
const cache = require('../cache');
const Queue = require('../queue');
const { sendEmail } = require('../email');
const RateLimiter = require('../rateLimiter');
const { healthCheck } = require('../health');
const metrics = require('../metrics');
const WebhookHandler = require('../webhook');

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  Logger.info('Health check requested');
  const health = await healthCheck();
  res.json(health);
});

// API status endpoint
app.get('/api/status', asyncHandler(async (req, res) => {
  Logger.info('API status check');
  metrics.increment('api.status.requests');
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    config: {
      env: config.env,
      port: config.port
    }
  });
}));

// Metrics endpoint
app.get('/api/metrics', (req, res) => {
  res.json(metrics.getReport());
});

// Webhook endpoint
const webhookHandler = new WebhookHandler();
app.post('/webhook/:event', express.json(), asyncHandler(async (req, res) => {
  const { event } = req.params;
  await webhookHandler.process(event, req.body);
  res.json({ received: true });
}));

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    Logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = { app, webhookHandler };
