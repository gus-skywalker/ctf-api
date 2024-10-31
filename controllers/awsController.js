// controllers/instanceController.js
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const Session = require('../models/Session');
require('dotenv').config();

// Inicializa o cliente ECS
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
    // Inicia a tarefa ECS
    const command = new RunTaskCommand(runTaskParams);
    const result = await ecsClient.send(command);
    const taskArn = result.tasks[0].taskArn;
    const instanceIP = 'http://seu-alb-dns.amazonaws.com'; /* Extraia o IP público ou URL da instância */

    // Descrever a tarefa para obter detalhes de rede, incluindo o IP
    // const describeParams = { cluster: clusterName, tasks: [taskArn] };
    // const describeCommand = new DescribeTasksCommand(describeParams);
    // const taskDetails = await ecsClient.send(describeCommand);

    // // Extrair o IP público da tarefa ECS
    // const instanceIP = taskDetails.tasks[0].attachments[0].details.find(
    //   (detail) => detail.name === 'publicIPv4Address'
    // ).value;

    // Salva a sessão no MongoDB
    const session = new Session({
      userId: req.user.id, // ID do usuário autenticado
      taskArn,
      instanceIP,
    });

    await session.save();
    res.json({ message: 'Instance started', taskArn, instanceIP });
  } catch (error) {
    console.error('Error starting instance:', error);
    res.status(500).send('Error starting instance');
  }
};
