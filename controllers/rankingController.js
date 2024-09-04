const User = require('../models/User');

exports.getRanking = async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1 }).limit(10);
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
