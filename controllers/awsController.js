// controllers/awsController.js
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
require('dotenv').config();

// Configuração do cliente ECS
const ecsClient = new ECSClient({ region: process.env.AWS_REGION });

exports.startInstance = async (req, res) => {
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

    // Retornar o ARN da tarefa para controle
    res.json({ message: 'Instance started', taskArn });
  } catch (error) {
    console.error('Error starting instance:', error);
    res.status(500).send('Error starting instance');
  }
};
