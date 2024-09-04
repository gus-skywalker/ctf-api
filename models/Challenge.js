const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    flag: { type: String, required: true },
    points: { type: Number, required: true }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
