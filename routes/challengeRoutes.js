const express = require('express');
const { getChallenges, getChallengesWithStatus, submitFlag, createChallenge } = require('../controllers/challengeController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuthMiddleware')
const router = express.Router();

router.get('/', auth, getChallenges);
router.get('/status', auth, getChallengesWithStatus);
router.post('/:id/validate', auth, submitFlag);
router.post('/', auth, adminAuth, createChallenge);

module.exports = router;
