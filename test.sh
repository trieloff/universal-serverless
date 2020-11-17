#!/bin/sh
echo "\nAmazon"
curl -i "https://wu1s8v9by9.execute-api.us-east-1.amazonaws.com/path?goo=mal"

echo "\nOpenwhisk"
curl -i "https://adobeioruntime.net/api/v1/web/trieloff/default/hello/path?goo=mal"

echo "\nAzure"
curl -i "https://universal-serverless.azurewebsites.net/api/hello"