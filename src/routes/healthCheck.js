/**
 * healthCheck Routes
 * Define rotas da API para healthCheck
 * @module routes/healthCheck
 */

const express = require('express');
const router = express.Router();

/**
 * GET / - Lista todos os itens
 * @route GET /
 * @returns {Object} 200 - Lista de itens
 */
router.get('/', (req, res) => {
  res.json({ 
    route: 'healthCheck',
    status: 'ok',
    items: [],
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /:id - Retorna item específico
 * @route GET /:id
 * @returns {Object} 200 - Item encontrado
 */
router.get('/:id', (req, res) => {
  res.json({
    id: req.params.id,
    route: 'healthCheck',
    status: 'ok'
  });
});

module.exports = router;
