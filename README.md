ctf-api/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── challengeController.js
│   └── rankingController.js
├── models/
│   ├── User.js
│   ├── Challenge.js
│   └── Submission.js
├── routes/
│   ├── authRoutes.js
│   ├── challengeRoutes.js
│   └── rankingRoutes.js
├── middleware/
│   └── authMiddleware.js
├── .env
├── app.js
├── package.json
└── README.md


Com esses comandos, você poderá coletar todos os dados que precisa para o .env:

Cluster ECS:
aws ecs list-clusters --output table

Task Definition:
aws ecs list-task-definitions --output table

VPC Id:
aws ec2 describe-vpcs --query "Vpcs[*].{ID:VpcId,Name:Tags[?Key=='Name']|[0].Value}" --output table

Subnets na VPC:
aws ec2 describe-subnets --filters "Name=vpc-id,Values=your-vpc-id" --query "Subnets[*].SubnetId" --output table

Verificar se subnet e Public or Private:
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-0ff22f351851c0f3a" --output json
ou
aws ec2 describe-route-tables --filters "Name=association.subnet-id,Values=your-subnet-id" --output json

Security Groups:
aws ec2 describe-security-groups --query "SecurityGroups[*].{ID:GroupId,Name:GroupName}" --output table

Região AWS:
aws configure get region

Testar Credenciais AWS:
aws s3 ls


Server running on port 5001
MongoDB connected...
Task started with ARN: arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89
Attempt 1: Task details - {
  "$metadata": {
    "httpStatusCode": 200,
    "requestId": "51c6d7de-2076-4445-a6f8-b32c92376041",
    "attempts": 1,
    "totalRetryDelay": 0
  },
  "failures": [],
  "tasks": [
    {
      "attachments": [
        {
          "details": [
            {
              "name": "subnetId",
              "value": "subnet-061871512377fcc9d"
            },
            {
              "name": "networkInterfaceId",
              "value": "eni-0f9be7af0b08f9642"
            },
            {
              "name": "macAddress",
              "value": "06:46:62:fe:09:5d"
            },
            {
              "name": "privateDnsName",
              "value": "ip-172-31-29-85.sa-east-1.compute.internal"
            },
            {
              "name": "privateIPv4Address",
              "value": "172.31.29.85"
            }
          ],
          "id": "6832a1dc-d786-431d-88a8-83522ce93594",
          "status": "ATTACHING",
          "type": "ElasticNetworkInterface"
        }
      ],
      "attributes": [
        {
          "name": "ecs.cpu-architecture",
          "value": "x86_64"
        }
      ],
      "availabilityZone": "sa-east-1b",
      "clusterArn": "arn:aws:ecs:sa-east-1:858413359195:cluster/CTFCluster",
      "containers": [
        {
          "containerArn": "arn:aws:ecs:sa-east-1:858413359195:container/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89/09d0d7c2-13ab-43e1-abc0-48674ab01651",
          "cpu": "0",
          "healthStatus": "UNKNOWN",
          "image": "858413359195.dkr.ecr.sa-east-1.amazonaws.com/scada-modbus-ctf:v2",
          "lastStatus": "PENDING",
          "name": "scada-modbus-ctf-container",
          "networkInterfaces": [
            {
              "attachmentId": "6832a1dc-d786-431d-88a8-83522ce93594",
              "privateIpv4Address": "172.31.29.85"
            }
          ],
          "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89"
        }
      ],
      "cpu": "1024",
      "createdAt": "2024-11-07T02:30:35.503Z",
      "desiredStatus": "RUNNING",
      "enableExecuteCommand": false,
      "ephemeralStorage": {
        "sizeInGiB": 20
      },
      "fargateEphemeralStorage": {
        "sizeInGiB": 20
      },
      "group": "family:scada-modbus-ctf-task",
      "healthStatus": "UNKNOWN",
      "lastStatus": "PROVISIONING",
      "launchType": "FARGATE",
      "memory": "3072",
      "overrides": {
        "containerOverrides": [
          {
            "name": "scada-modbus-ctf-container"
          }
        ],
        "inferenceAcceleratorOverrides": []
      },
      "platformFamily": "Linux",
      "platformVersion": "1.4.0",
      "tags": [],
      "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89",
      "taskDefinitionArn": "arn:aws:ecs:sa-east-1:858413359195:task-definition/scada-modbus-ctf-task:3",
      "version": 1
    }
  ]
}
Attempt 2: Task details - {
  "$metadata": {
    "httpStatusCode": 200,
    "requestId": "aa259a7e-3df9-4093-b780-3578f5e747c3",
    "attempts": 1,
    "totalRetryDelay": 0
  },
  "failures": [],
  "tasks": [
    {
      "attachments": [
        {
          "details": [
            {
              "name": "subnetId",
              "value": "subnet-061871512377fcc9d"
            },
            {
              "name": "networkInterfaceId",
              "value": "eni-0f9be7af0b08f9642"
            },
            {
              "name": "macAddress",
              "value": "06:46:62:fe:09:5d"
            },
            {
              "name": "privateDnsName",
              "value": "ip-172-31-29-85.sa-east-1.compute.internal"
            },
            {
              "name": "privateIPv4Address",
              "value": "172.31.29.85"
            }
          ],
          "id": "6832a1dc-d786-431d-88a8-83522ce93594",
          "status": "ATTACHED",
          "type": "ElasticNetworkInterface"
        }
      ],
      "attributes": [
        {
          "name": "ecs.cpu-architecture",
          "value": "x86_64"
        }
      ],
      "availabilityZone": "sa-east-1b",
      "clusterArn": "arn:aws:ecs:sa-east-1:858413359195:cluster/CTFCluster",
      "containers": [
        {
          "containerArn": "arn:aws:ecs:sa-east-1:858413359195:container/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89/09d0d7c2-13ab-43e1-abc0-48674ab01651",
          "cpu": "0",
          "healthStatus": "UNKNOWN",
          "image": "858413359195.dkr.ecr.sa-east-1.amazonaws.com/scada-modbus-ctf:v2",
          "lastStatus": "PENDING",
          "name": "scada-modbus-ctf-container",
          "networkInterfaces": [
            {
              "attachmentId": "6832a1dc-d786-431d-88a8-83522ce93594",
              "privateIpv4Address": "172.31.29.85"
            }
          ],
          "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89"
        }
      ],
      "cpu": "1024",
      "createdAt": "2024-11-07T02:30:35.503Z",
      "desiredStatus": "RUNNING",
      "enableExecuteCommand": false,
      "ephemeralStorage": {
        "sizeInGiB": 20
      },
      "fargateEphemeralStorage": {
        "sizeInGiB": 20
      },
      "group": "family:scada-modbus-ctf-task",
      "healthStatus": "UNKNOWN",
      "lastStatus": "PROVISIONING",
      "launchType": "FARGATE",
      "memory": "3072",
      "overrides": {
        "containerOverrides": [
          {
            "name": "scada-modbus-ctf-container"
          }
        ],
        "inferenceAcceleratorOverrides": []
      },
      "platformFamily": "Linux",
      "platformVersion": "1.4.0",
      "tags": [],
      "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89",
      "taskDefinitionArn": "arn:aws:ecs:sa-east-1:858413359195:task-definition/scada-modbus-ctf-task:3",
      "version": 1
    }
  ]
}
Attempt 3: Task details - {
  "$metadata": {
    "httpStatusCode": 200,
    "requestId": "d069db4e-afea-4623-9d0e-96c9640cbd98",
    "attempts": 1,
    "totalRetryDelay": 0
  },
  "failures": [],
  "tasks": [
    {
      "attachments": [
        {
          "details": [
            {
              "name": "subnetId",
              "value": "subnet-061871512377fcc9d"
            },
            {
              "name": "networkInterfaceId",
              "value": "eni-0f9be7af0b08f9642"
            },
            {
              "name": "macAddress",
              "value": "06:46:62:fe:09:5d"
            },
            {
              "name": "privateDnsName",
              "value": "ip-172-31-29-85.sa-east-1.compute.internal"
            },
            {
              "name": "privateIPv4Address",
              "value": "172.31.29.85"
            }
          ],
          "id": "6832a1dc-d786-431d-88a8-83522ce93594",
          "status": "ATTACHED",
          "type": "ElasticNetworkInterface"
        }
      ],
      "attributes": [
        {
          "name": "ecs.cpu-architecture",
          "value": "x86_64"
        }
      ],
      "availabilityZone": "sa-east-1b",
      "clusterArn": "arn:aws:ecs:sa-east-1:858413359195:cluster/CTFCluster",
      "containers": [
        {
          "containerArn": "arn:aws:ecs:sa-east-1:858413359195:container/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89/09d0d7c2-13ab-43e1-abc0-48674ab01651",
          "cpu": "0",
          "healthStatus": "UNKNOWN",
          "image": "858413359195.dkr.ecr.sa-east-1.amazonaws.com/scada-modbus-ctf:v2",
          "lastStatus": "PENDING",
          "name": "scada-modbus-ctf-container",
          "networkInterfaces": [
            {
              "attachmentId": "6832a1dc-d786-431d-88a8-83522ce93594",
              "privateIpv4Address": "172.31.29.85"
            }
          ],
          "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89"
        }
      ],
      "cpu": "1024",
      "createdAt": "2024-11-07T02:30:35.503Z",
      "desiredStatus": "RUNNING",
      "enableExecuteCommand": false,
      "ephemeralStorage": {
        "sizeInGiB": 20
      },
      "fargateEphemeralStorage": {
        "sizeInGiB": 20
      },
      "group": "family:scada-modbus-ctf-task",
      "healthStatus": "UNKNOWN",
      "lastStatus": "PENDING",
      "launchType": "FARGATE",
      "memory": "3072",
      "overrides": {
        "containerOverrides": [
          {
            "name": "scada-modbus-ctf-container"
          }
        ],
        "inferenceAcceleratorOverrides": []
      },
      "platformFamily": "Linux",
      "platformVersion": "1.4.0",
      "tags": [],
      "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89",
      "taskDefinitionArn": "arn:aws:ecs:sa-east-1:858413359195:task-definition/scada-modbus-ctf-task:3",
      "version": 2
    }
  ]
}
Attempt 4: Task details - {
  "$metadata": {
    "httpStatusCode": 200,
    "requestId": "0f686608-9895-4240-8fbf-396d5598feab",
    "attempts": 1,
    "totalRetryDelay": 0
  },
  "failures": [],
  "tasks": [
    {
      "attachments": [
        {
          "details": [
            {
              "name": "subnetId",
              "value": "subnet-061871512377fcc9d"
            },
            {
              "name": "networkInterfaceId",
              "value": "eni-0f9be7af0b08f9642"
            },
            {
              "name": "macAddress",
              "value": "06:46:62:fe:09:5d"
            },
            {
              "name": "privateDnsName",
              "value": "ip-172-31-29-85.sa-east-1.compute.internal"
            },
            {
              "name": "privateIPv4Address",
              "value": "172.31.29.85"
            }
          ],
          "id": "6832a1dc-d786-431d-88a8-83522ce93594",
          "status": "ATTACHED",
          "type": "ElasticNetworkInterface"
        }
      ],
      "attributes": [
        {
          "name": "ecs.cpu-architecture",
          "value": "x86_64"
        }
      ],
      "availabilityZone": "sa-east-1b",
      "clusterArn": "arn:aws:ecs:sa-east-1:858413359195:cluster/CTFCluster",
      "containers": [
        {
          "containerArn": "arn:aws:ecs:sa-east-1:858413359195:container/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89/09d0d7c2-13ab-43e1-abc0-48674ab01651",
          "cpu": "0",
          "healthStatus": "UNKNOWN",
          "image": "858413359195.dkr.ecr.sa-east-1.amazonaws.com/scada-modbus-ctf:v2",
          "lastStatus": "PENDING",
          "name": "scada-modbus-ctf-container",
          "networkInterfaces": [
            {
              "attachmentId": "6832a1dc-d786-431d-88a8-83522ce93594",
              "privateIpv4Address": "172.31.29.85"
            }
          ],
          "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89"
        }
      ],
      "cpu": "1024",
      "createdAt": "2024-11-07T02:30:35.503Z",
      "desiredStatus": "RUNNING",
      "enableExecuteCommand": false,
      "ephemeralStorage": {
        "sizeInGiB": 20
      },
      "fargateEphemeralStorage": {
        "sizeInGiB": 20
      },
      "group": "family:scada-modbus-ctf-task",
      "healthStatus": "UNKNOWN",
      "lastStatus": "PENDING",
      "launchType": "FARGATE",
      "memory": "3072",
      "overrides": {
        "containerOverrides": [
          {
            "name": "scada-modbus-ctf-container"
          }
        ],
        "inferenceAcceleratorOverrides": []
      },
      "platformFamily": "Linux",
      "platformVersion": "1.4.0",
      "tags": [],
      "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89",
      "taskDefinitionArn": "arn:aws:ecs:sa-east-1:858413359195:task-definition/scada-modbus-ctf-task:3",
      "version": 2
    }
  ]
}
Attempt 5: Task details - {
  "$metadata": {
    "httpStatusCode": 200,
    "requestId": "72392805-4cc7-460d-bbb8-96643f78c589",
    "attempts": 1,
    "totalRetryDelay": 0
  },
  "failures": [],
  "tasks": [
    {
      "attachments": [
        {
          "details": [
            {
              "name": "subnetId",
              "value": "subnet-061871512377fcc9d"
            },
            {
              "name": "networkInterfaceId",
              "value": "eni-0f9be7af0b08f9642"
            },
            {
              "name": "macAddress",
              "value": "06:46:62:fe:09:5d"
            },
            {
              "name": "privateDnsName",
              "value": "ip-172-31-29-85.sa-east-1.compute.internal"
            },
            {
              "name": "privateIPv4Address",
              "value": "172.31.29.85"
            }
          ],
          "id": "6832a1dc-d786-431d-88a8-83522ce93594",
          "status": "ATTACHED",
          "type": "ElasticNetworkInterface"
        }
      ],
      "attributes": [
        {
          "name": "ecs.cpu-architecture",
          "value": "x86_64"
        }
      ],
      "availabilityZone": "sa-east-1b",
      "clusterArn": "arn:aws:ecs:sa-east-1:858413359195:cluster/CTFCluster",
      "containers": [
        {
          "containerArn": "arn:aws:ecs:sa-east-1:858413359195:container/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89/09d0d7c2-13ab-43e1-abc0-48674ab01651",
          "cpu": "0",
          "healthStatus": "UNKNOWN",
          "image": "858413359195.dkr.ecr.sa-east-1.amazonaws.com/scada-modbus-ctf:v2",
          "lastStatus": "PENDING",
          "name": "scada-modbus-ctf-container",
          "networkInterfaces": [
            {
              "attachmentId": "6832a1dc-d786-431d-88a8-83522ce93594",
              "privateIpv4Address": "172.31.29.85"
            }
          ],
          "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89"
        }
      ],
      "cpu": "1024",
      "createdAt": "2024-11-07T02:30:35.503Z",
      "desiredStatus": "RUNNING",
      "enableExecuteCommand": false,
      "ephemeralStorage": {
        "sizeInGiB": 20
      },
      "fargateEphemeralStorage": {
        "sizeInGiB": 20
      },
      "group": "family:scada-modbus-ctf-task",
      "healthStatus": "UNKNOWN",
      "lastStatus": "PENDING",
      "launchType": "FARGATE",
      "memory": "3072",
      "overrides": {
        "containerOverrides": [
          {
            "name": "scada-modbus-ctf-container"
          }
        ],
        "inferenceAcceleratorOverrides": []
      },
      "platformFamily": "Linux",
      "platformVersion": "1.4.0",
      "tags": [],
      "taskArn": "arn:aws:ecs:sa-east-1:858413359195:task/CTFCluster/6f9fb5e05ade4aa7b645e1088d756b89",
      "taskDefinitionArn": "arn:aws:ecs:sa-east-1:858413359195:task-definition/scada-modbus-ctf-task:3",
      "version": 2
    }
  ]
}
