const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const User = require('../models/User');

exports.getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({}, 'title description points'); // Exclui a flag
        res.json(challenges);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.submitFlag = async (req, res) => {
    const { challengeId, flag } = req.body;
    const userId = req.user.id;

    try {
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });

        const isCorrect = (flag === challenge.flag);

        const submission = new Submission({
            user: userId,
            challenge: challengeId,
            isCorrect
        });

        if (isCorrect) {
            const user = await User.findById(userId);
            user.score += challenge.points;
            await user.save();
        }

        await submission.save();
        res.json({ isCorrect });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.createChallenge = async (req, res) => {
    const { title, description, flag, points } = req.body;

    try {
        // Cria um novo desafio com os dados fornecidos
        const newChallenge = new Challenge({
            title,
            description,
            flag,
            points
        });

        // Salva o desafio no banco de dados
        await newChallenge.save();
        res.status(201).json({ msg: 'Challenge created successfully', challenge: newChallenge });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

