const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    timestamp: { type: Date, default: Date.now },
    isCorrect: { type: Boolean, default: false }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
