/**
 * userRoutes Routes
 * Define rotas da API para userRoutes
 * @module routes/userRoutes
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
    route: 'userRoutes',
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
    route: 'userRoutes',
    status: 'ok'
  });
});

module.exports = router;
