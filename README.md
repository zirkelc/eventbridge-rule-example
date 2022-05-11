# eventbridge-rule-example
AWS EventBridge Rules to Invoke Lambda and StepFunction

This is an example on how to set up EventBridge rules to invoke Lambda functions and StepFunctions state machines on certain events.

## Try It Out
First, install all dependencies:
```sh
npm install
```

Then, deploy the stack with Serverless:
```sh
npx sls deploy
```

All resources are going to be prefixed with the service name `eventbridge-rule-example` and the deployment stage `dev`, for example `eventbridge-rule-example-dev-test`. Two EventBridge rules are being created that listen for events with `detail-type` set to `start-state-machine` and `start-lambda-function` and will invoke state machine or function when they recive an event.

To send an event, use the AWS console or the AWS CLI and provide the `detail-type` for `start-lambda-function`:



