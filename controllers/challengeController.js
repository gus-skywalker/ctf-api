const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const User = require('../models/User');

exports.getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({}, 'title description points');
        res.json(challenges);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getChallengesWithStatus = async (req, res) => {
    const userId = req.user.id;

    try {
        const challenges = await Challenge.find({}, 'title description points flag');

        // Busca submissões corretas para o usuário
        const correctSubmissions = await Submission.find({ user: userId, isCorrect: true })
            .select('challenge')
            .lean();

        // Cria um conjunto com os IDs dos desafios já concluídos
        const completedChallengeIds = new Set(correctSubmissions.map(sub => sub.challenge.toString()));

        // Adiciona a propriedade `completed` e a flag para cada desafio completado
        const challengesWithStatus = challenges.map(challenge => {
        const isCompleted = completedChallengeIds.has(challenge._id.toString());
        return {
            ...challenge.toObject(),
            completed: isCompleted,
            flag: isCompleted ? challenge.flag : undefined // Exibe a flag somente se o desafio foi completado
        };
    });

        res.json(challengesWithStatus);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.submitFlag = async (req, res) => {
    const { id: challengeId } = req.params;
    const { flag } = req.body;
    const userId = req.user.id;

    try {
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });

        // Verifica se o usuário já completou o desafio
        const existingSubmission = await Submission.findOne({
            user: userId,
            challenge: challengeId,
            isCorrect: true
        });

        // Se já existe uma submissão correta, retorna uma mensagem informativa
        if (existingSubmission) {
            return res.status(400).json({ msg: 'Challenge already completed' });
        }

        // Verifica se a flag está correta
        const isCorrect = (flag === challenge.flag);

        // Registra a tentativa de submissão
        const submission = new Submission({
            user: userId,
            challenge: challengeId,
            isCorrect
        });
        await submission.save();

        // Atualiza a pontuação do usuário se a flag estiver correta
        if (isCorrect) {
            const user = await User.findById(userId);
            user.score += challenge.points;
            await user.save();
        }

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

