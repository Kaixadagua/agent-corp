/**
 * users Routes
 * Define rotas da API
 */

const express = require('express');
const router = express.Router();

/**
 * GET / - Lista todos os itens
 */
router.get('/', (req, res) => {
  res.json({ 
    route: 'users',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
