#!/bin/sh
echo "\nAmazon"
curl -i -X POST -H "Content-Type: text/plain" -d 'Hello Amazon' "https://wu1s8v9by9.execute-api.us-east-1.amazonaws.com/path?goo=mal"

echo "\nOpenwhisk"
curl -i -X POST -H "Content-Type: text/plain" -d 'Hello Adobe'  "https://adobeioruntime.net/api/v1/web/trieloff/default/hello/path?goo=mal"

echo "\nAzure"
curl -i -X POST -H "Content-Type: text/plain" -d 'Hello Azure'  "https://universal-serverless.azurewebsites.net/api/hello?goo=mal"

echo "\nGoogle"
curl -i  -X POST -H "Content-Type: text/plain" -d 'Hello A^HGoogle'  "https://us-central1-helix-225321.cloudfunctions.net/hello?goo=mal"


echo "\nAmazon"
curl -X PUT -H "Content-Type: image/png" -T test.png "https://wu1s8v9by9.execute-api.us-east-1.amazonaws.com/hello/path?goo=mal"  --output lambda.png

echo "\nOpenwhisk"
curl -X PUT -H "Content-Type: image/png" -T test.png "https://adobeioruntime.net/api/v1/web/trieloff/default/hello/path?goo=mal"  --output openwhisk.png

# https://github.com/Azure/azure-functions-nodejs-worker/issues/294
echo "\nAzure"
curl -X PUT -H "Content-Type: application/octet-stream" -T test.png "https://universal-serverless.azurewebsites.net/api/hello?goo=mal"  --output azure.png

echo "\nGoogle"
curl -X PUT -H "Content-Type: image/png" -T test.png "https://us-central1-helix-225321.cloudfunctions.net/hello?goo=mal" --output google.png