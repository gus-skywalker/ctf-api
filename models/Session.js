// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskArn: { type: String, required: true },
    instanceIP: { type: String, required: false }, // Tornar não obrigatório
    lastActive: { type: Date, default: Date.now },
    status: { type: String, default: 'PENDING' }, // Campo de status
  });

module.exports = mongoose.model('Session', sessionSchema);
