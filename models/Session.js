// models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskArn: { type: String, required: true },
    instanceIP: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Expira após 24 horas
});

module.exports = mongoose.model('Session', SessionSchema);
