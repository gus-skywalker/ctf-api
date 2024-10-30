const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const authenticateToken = require('./middleware/authMiddleware.js');

const app = express();
const connectDB = require('./config/db');
require('dotenv').config();

// Conectar ao MongoDB
connectDB();

// Middleware
app.use(express.json({ extended: false }));

const ecsClient = new ECSClient({ region: process.env.AWS_REGION });

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/ranking', require('./routes/rankingRoutes'));

const users = []; // Em um ambiente real, armazene no DynamoDB ou MongoDB

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/start-instance', authenticateToken, async (req, res) => {
    const clusterName = 'your-cluster-name';
    const taskDefinition = 'your-task-definition';
  
    const runTaskParams = {
      cluster: clusterName,
      taskDefinition,
      count: 1,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: ['your-subnet-id'],
          securityGroups: ['your-security-group-id'],
          assignPublicIp: 'ENABLED',
        },
      },
    };
  
    try {
      const command = new RunTaskCommand(runTaskParams);
      const result = await ecsClient.send(command);
      const taskArn = result.tasks[0].taskArn;
  
      // Armazene o mapeamento do usuário para a instância
      res.json({ message: 'Instance started', taskArn });
    } catch (error) {
      console.error('Error starting instance:', error);
      res.status(500).send('Error starting instance');
    }
  });
  

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

