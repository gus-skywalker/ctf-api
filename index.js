const express = require('express');
const cors = require('cors');

const app = express();
const connectDB = require('./config/db');
require('dotenv').config();

const allowedOrigins = ['http://localhost:4000', 'http://localhost:5173', 'https://ctf.lesmonades.com', 'http://ctf.lesmonades.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Conectar ao MongoDB
connectDB();

// Middleware
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/ranking', require('./routes/rankingRoutes'));
app.use('/api/aws', require('./routes/awsRoutes'));
  
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

