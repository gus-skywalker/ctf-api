const express = require('express');
const { 
  startInstance, 
  stopInstance, 
  updateLastActive, 
  cleanUpInactiveInstances, 
  instanceStatus 
} = require('../controllers/awsController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para iniciar uma instância AWS ECS
router.post('/start-instance', authenticateToken, startInstance);

// Rota para parar uma instância AWS ECS
router.post('/stop-instance', authenticateToken, stopInstance);

// Rota para verificar o status da instância do usuário
router.get('/status-instance', authenticateToken, instanceStatus);

// Rota para atualizar a última atividade do usuário
router.patch('/update-last-active', authenticateToken, (req, res) => {
  if (req.body.action === 'updateLastActive') {
    updateLastActive(req.user.id);
    res.json({ message: 'Last activity updated' });
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

// Rota para limpar instâncias inativas (idealmente, restrito a admins)
router.post('/clean-up-inactive', authenticateToken, async (req, res) => {
  try {
    await cleanUpInactiveInstances();
    res.json({ message: 'Inactive instances cleaned up' });
  } catch (error) {
    console.error('Error cleaning up inactive instances:', error);
    res.status(500).send('Error cleaning up inactive instances');
  }
});

module.exports = router;
