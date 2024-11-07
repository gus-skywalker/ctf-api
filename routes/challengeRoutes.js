const express = require('express');
const { getChallenges, submitFlag } = require('../controllers/challengeController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuthMiddleware')
const router = express.Router();

router.get('/', auth, getChallenges);
router.post('/submit/:id/submit', auth, submitFlag);
router.post('/challenges', auth, adminAuth, challengeController.createChallenge);

module.exports = router;
