const express = require('express');
const { register, login, update } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.patch('/update', authMiddleware, update);

module.exports = router;
