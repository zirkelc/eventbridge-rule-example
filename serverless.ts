import { Serverless } from "serverless/plugins/aws/provider/awsProvider";

const serverlessConfiguration: Serverless & Record<'stepFunctions', any> = {
  service: 'eventbridge-rule-example',
  frameworkVersion: '3',
  package: {
    individually: true,
  },
  plugins: ['serverless-esbuild', 'serverless-step-functions'],
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    stage: 'dev',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps',
    },
  },
  functions: {
    test: {
      handler: 'src/functions/test.handle',
    },
  },
  stepFunctions: {
    stateMachines: {
      test: {
        id: 'TestStateMachine',
        name: '${self:service}-${sls:stage}-test',
        definition: {
          StartAt: 'Start',
          States: {
            Start: {
              Type: 'Task',
              Resource: {
                'Fn::GetAtt': ['TestLambdaFunction', 'Arn'],
              },
              End: true,
            }
          },
        },
      },
    },
  },
  resources: {
    Resources: {
      InvokeStateMachineEventRule: {
        Type: 'AWS::Events::Rule',
        Properties: {
          EventBusName: 'default',
          EventPattern: {
            'detail-type': ['start-state-machine'], 
          },
          Name: 'start-state-machine',
          State: 'ENABLED',
          Targets: [
            {
              Arn: { 'Fn::GetAtt': ['TestStateMachine', 'Arn'] },
              Id: 'TestStateMachine',
              RoleArn: { 'Fn::GetAtt': ['InvokeStateMachineIamRole', 'Arn'] },
            },
          ],
        },
      },
      InvokeStateMachineIamRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: ['events.amazonaws.com'],
                },
                Action: 'sts:AssumeRole',
              },
            ],
          },
          Policies: [
            {
              PolicyName: 'InvokeStateMachineRolePolicy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: [
                      'states:StartExecution',
                    ],
                    Resource: [
                      { 'Fn::GetAtt': ['TestStateMachine', 'Arn'] },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
      InvokeLambdaFunctionEventRule: {
        Type: 'AWS::Events::Rule',
        Properties: {
          EventBusName: 'default',
          EventPattern: {
            'detail-type': ['start-lambda-function'],
          },
          Name: 'start-lambda-function',
          State: 'ENABLED',
          Targets: [
            {
              Arn: { 'Fn::GetAtt': ['TestLambdaFunction', 'Arn'] },
              Id: 'TestLambdaFunction',
            },
          ],
        },
      },
      InvokeLambdaFunctionPermission: {
        Type: 'AWS::Lambda::Permission',
        Properties: {
          FunctionName: { 'Fn::GetAtt': ['TestLambdaFunction', 'Arn'], },
          Action: 'lambda:InvokeFunction',
          Principal: 'events.amazonaws.com',
          SourceArn: { 'Fn::GetAtt': ['InvokeLambdaFunctionEventRule', 'Arn'] },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
