// routes/awsRoutes.js
const express = require('express');
const { startInstance } = require('../controllers/awsController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para iniciar uma instância AWS ECS
router.post('/start-instance', authenticateToken, startInstance);

module.exports = router;
