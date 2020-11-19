#!/bin/sh

# Lambda
aws lambda update-function-code --function-name=hello --zip-file=fileb://$(pwd)/hello.zip
aws lambda update-function-configuration --function-name=hello --handler=index.lambda

# OpenWhisk
wsk action update hello hello.zip --kind nodejs:12 --web raw --main openwhisk --param HELLO world

# Azure
# 1. Open your function app in the Azure portal and go to "Overview"
# 2. Click "Get Publish Profile"
# 3. Open the downloaded XML file and look for `userName` and `userPWD` and store them, separated by `:` in `$AZURE_AUTH`
# 4. Open your function app in the Azure portal and go to "Configuration"
# 5. Make sure that neither WEBSITE_RUN_FROM_PACKAGE or WEBSITE_USE_ZIP are set
curl -X POST -u $AZURE_AUTH https://universal-serverless.scm.azurewebsites.net/api/zipdeploy -T hello.zip


# Google
# Google CLI deploys from a directory instead of a zip file 
gcloud functions deploy hello --entry-point google --runtime nodejs12 --trigger-http --allow-unauthenticated --source=hello