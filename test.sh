#!/bin/sh
echo "\nAmazon"
curl -i -X POST -H "Content-Type: text/plain" -d 'Hello Amazon' "https://wu1s8v9by9.execute-api.us-east-1.amazonaws.com/path?goo=mal"

echo "\nOpenwhisk"
curl -i -X POST -H "Content-Type: text/plain" -d 'Hello Adobe'  "https://adobeioruntime.net/api/v1/web/trieloff/default/hello/path?goo=mal"

echo "\nAzure"
curl -i -X POST -H "Content-Type: text/plain" -d 'Hello Azure'  "https://universal-serverless.azurewebsites.net/api/hello?goo=mal"

echo "\nGoogle"
curl -i  -X POST -H "Content-Type: text/plain" -d 'Hello A^HGoogle'  "https://us-central1-helix-225321.cloudfunctions.net/hello?goo=mal"