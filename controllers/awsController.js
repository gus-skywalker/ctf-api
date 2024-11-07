const {
  ECSClient,
  RunTaskCommand,
  DescribeTasksCommand,
  StopTaskCommand,
} = require("@aws-sdk/client-ecs");
const { EC2Client, DescribeNetworkInterfacesCommand } = require("@aws-sdk/client-ec2");
const Session = require("../models/Session");
require("dotenv").config();

const ecsClient = new ECSClient({ region: process.env.AWS_REGION });
const ec2Client = new EC2Client({ region: process.env.AWS_REGION });
const clusterName = process.env.ECS_CLUSTER;
const taskDefinition = process.env.ECS_TASK_DEFINITION;
const inactivityLimit = 60 * 60 * 1000; // 1 hora em milissegundos

const runTaskParams = {
  cluster: clusterName,
  taskDefinition,
  count: 1,
  launchType: "FARGATE",
  networkConfiguration: {
    awsvpcConfiguration: {
      subnets: process.env.SUBNET_ID.split(","), // Divide a lista de subnets
      securityGroups: [process.env.SECURITY_GROUP_ID],
      assignPublicIp: "ENABLED",
    },
  },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// Inicia uma nova tarefa ECS para um usuário e salva a sessão
exports.startInstance = async (req, res) => {
  try {
    const command = new RunTaskCommand(runTaskParams);
    const result = await ecsClient.send(command);
    const taskArn = result.tasks[0].taskArn;

    console.log(`Task started with ARN: ${taskArn}`);

    // Salva a sessão inicial no MongoDB com status pendente
    const session = new Session({
      userId: req.user.id,
      taskArn,
      instanceIP: null, // IP público ainda não disponível
      lastActive: new Date(),
      status: 'PENDING', // Status inicial
    });

    await session.save();

    // Responde imediatamente ao cliente
    res.json({
      message: 'Instance is starting. Check back for IP.',
      taskArn,
      status: 'PENDING',
    });

    // Executa a função de verificação do IP em segundo plano
    checkAndAssignPublicIP(taskArn, req.user.id);

  } catch (error) {
    console.error('Error starting instance:', error);
    res.status(500).send('Error starting instance');
  }
};

// Função assíncrona em segundo plano para verificar o IP público
async function checkAndAssignPublicIP(taskArn, userId) {
  try {
    let instanceIP = null;
    let taskStatus = null;

    // Loop para tentar capturar o IP público
    for (let i = 0; i < 20; i++) {
      await delay(15000); // Espera 15 segundos entre tentativas
      const describeParams = { cluster: clusterName, tasks: [taskArn] };
      const taskDetails = await ecsClient.send(new DescribeTasksCommand(describeParams));

      taskStatus = taskDetails.tasks[0].lastStatus;
      console.log(`Attempt ${i + 1}: Task status - ${taskStatus}`);

      if (taskStatus === 'RUNNING') {
        const task = taskDetails.tasks[0];
        
        // Tenta capturar o IP público diretamente da ENI se não estiver nos detalhes da tarefa
        const networkInterfaceId = task.attachments[0].details.find(
          (detail) => detail.name === 'networkInterfaceId'
        ).value;

        if (networkInterfaceId) {
          instanceIP = await getPublicIPFromENI(networkInterfaceId);
          if (instanceIP) break;
        }
      }
    }

    if (instanceIP) {
      await Session.updateOne(
        { userId, taskArn },
        { $set: { instanceIP, status: 'READY' } }
      );
      console.log(`Instance IP updated for user ${userId}: ${instanceIP}`);
    } else {
      console.log("IP público não disponível após múltiplas tentativas.");
      await Session.updateOne(
        { userId, taskArn },
        { $set: { status: 'FAILED' } }
      );
    }

  } catch (error) {
    console.error('Error checking instance IP:', error);
  }
}

// Função para obter o IP público diretamente da ENI
async function getPublicIPFromENI(networkInterfaceId) {
  const params = { NetworkInterfaceIds: [networkInterfaceId] };
  const command = new DescribeNetworkInterfacesCommand(params);
  const result = await ec2Client.send(command);

  if (result.NetworkInterfaces && result.NetworkInterfaces[0].Association) {
    return result.NetworkInterfaces[0].Association.PublicIp;
  }
  return null;
}


// Para uma instância ECS de um usuário específico e remove o mapeamento do MongoDB
exports.stopInstance = async (req, res) => {
  try {
    const session = await Session.findOne({ userId: req.user.id });
    if (!session) {
      return res
        .status(404)
        .json({ message: "No active instance found for user" });
    }

    const stopCommand = new StopTaskCommand({
      cluster: clusterName,
      task: session.taskArn,
    });
    await ecsClient.send(stopCommand);

    await Session.deleteOne({ userId: req.user.id });
    res.json({ message: "Instance stopped successfully" });
  } catch (error) {
    console.error("Error stopping instance:", error);
    res.status(500).send("Error stopping instance");
  }
};

// Limpa instâncias inativas
exports.cleanUpInactiveInstances = async () => {
  const currentTime = new Date();
  const inactiveSessions = await Session.find({
    lastActive: { $lt: new Date(currentTime - inactivityLimit) },
  });

  for (const session of inactiveSessions) {
    try {
      const stopCommand = new StopTaskCommand({
        cluster: clusterName,
        task: session.taskArn,
      });
      await ecsClient.send(stopCommand);

      await Session.deleteOne({ _id: session._id });
      console.log(
        `Stopped and removed inactive instance for userId: ${session.userId}`
      );
    } catch (error) {
      console.error(
        `Error stopping instance for userId: ${session.userId}`,
        error
      );
    }
  }
};

// Atualiza a última atividade do usuário
exports.updateLastActive = async (userId) => {
  await Session.updateOne({ userId }, { $set: { lastActive: new Date() } });
};

// Obtém o status da instância do usuário autenticado
exports.instanceStatus = async (req, res) => {
  try {
    const session = await Session.findOne({ userId: req.user.id });
    if (!session) {
      return res
        .status(404)
        .json({ message: "No active instance found for user" });
    }
    res.json({
      taskArn: session.taskArn,
      instanceIP: session.instanceIP,
      lastActive: session.lastActive,
    });
  } catch (error) {
    console.error("Error fetching instance status:", error);
    res.status(500).send("Error fetching instance status");
  }
};