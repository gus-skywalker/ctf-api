const express = require('express');
const { getChallenges, submitFlag } = require('../controllers/challengeController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getChallenges);
router.post('/submit', auth, submitFlag);

module.exports = router;
