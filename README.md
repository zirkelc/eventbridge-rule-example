# eventbridge-rule-example
AWS EventBridge Rules to Invoke Lambda and StepFunction

This is an example on how to set up EventBridge rules to invoke Lambda functions and StepFunctions state machines on certain events.

For detailed information, please read this post: https://dev.to/zirkelc/eventbridge-rules-to-invoke-lambda-and-stepfunction-584m

## Try It Out
First, install all dependencies:
```sh
npm install
```

Then, deploy the stack with Serverless:
```sh
npx sls deploy
```

All resources are going to be prefixed with the service name `eventbridge-rule-example` and the deployment stage `dev`, for example `eventbridge-rule-example-dev-test`. 

Two EventBridge rules are being created that listen for events with `detail-type` set to `start-state-machine` and `start-lambda-function` and will invoke state machine or function when they recive an event.

To send an event with EventBridge, use the AWS console or the AWS CLI and provide `start-lambda-function` as `detail-type` and some JSON as `detail`:

![image](https://user-images.githubusercontent.com/950244/167805165-1dbb8ed9-d741-4dcd-b99f-f2369deda11d.png)

Then, check CloudWatch logs to verify the successful invocation of the Lambda function:

![image](https://user-images.githubusercontent.com/950244/167805557-10218fb0-b483-42d1-ac54-8169409c040e.png)


