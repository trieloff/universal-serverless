# Universal Serverless Experiment

> Is write once, run everywhere possible for serverless computing.

This experiment tries to do two things:

1. create a package that can be deployed to as many serverless platforms as possible
2. provide adapter code so that all serverless platforms can execute one single, platform-agnostic function

With following limitations:

- Assumes that the runtime is node.js (version 10+)
- The only supported trigger is HTTP
- None of the outbound platform APIs will be abstracted

## Supported Runtimes

- Apache OpenWhisk (`openwhisk.js`)
- AWS Lambda (`lambda.js`)
- Azure Functions (`index.js`)

# Developing

```bash
# create a zip file
$ sh build.sh

# deploy it everywhere
$ sh deploy.sh

# fetch the results
$ sh test.sh
```