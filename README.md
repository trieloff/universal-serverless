# Universal Serverless Experiment

> Is write once, run everywhere possible for serverless computing?

This experiment tries to do two things:

1. create a package that can be deployed to as many serverless platforms as possible
2. provide adapter code so that all serverless platforms can execute one single, platform-agnostic function

With following limitations:

- Assumes that the runtime is node.js (version 10+)
- The only supported trigger is HTTP
- None of the outbound platform APIs will be abstracted

## Supported Runtimes

- Apache OpenWhisk
- AWS Lambda
- Azure Functions
- Google Cloud Functions

## API

```javascript
// we use the fetch API, and node-fetch is a good approximation
const { Response } = require("node-fetch");

module.exports.main = async function(request, context) {
  let body = "hello world!\n\n";
  
  try {
    body += JSON.stringify(context, null, "  ");
  } catch {
    body += context.toString();
  }
  
  body += "\n" + request.url;
  body += "\n" + request.method;
  body += "\n" + request.headers.get('user-agent');
  body += "\n" + request.body.toString();
  
  return new Response(body, {
    status: 201,
    headers: {
      'Content-Type': 'text/plain',
      'X-Generator': 'hello world'
    }
  });
}
```

# Developing

```bash
# create a zip file
$ sh build.sh

# deploy it everywhere
$ sh deploy.sh

# fetch the results
$ sh test.sh
```
