const { main } = require("./main.js");
const { Request } = require("node-fetch");
/*
 * Universal Wrapper for serverless functions
 */

// Azure
module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  try {
    const request = new Request(req.url, {
      method: req.method,
      headers: req.headers
    });
    const con = {
      runtime: {
        name: 'azure-functions',
        args: arguments
      }
    };
    
    const response = await main(request, con);
    
    context.res = {
      status: response.status,
      headers: Array.from(response.headers.entries()).reduce((h, [header, value]) => {
        h[header] = value;
        return h;
      }, {}),
      body: await response.text()
    };
  } catch (e) {
    context.res = {
      status: 500,
      headers: {
        "Content-Type": "text/plain"
      },
      body: e.message
    }
  }
}

// OW
module.exports.openwhisk = async function(params) {
  try {
    const request = new Request(`https://${params.__ow_headers['x-forwarded-host'].split(',')[0]}/api/v1/web${process.env['__OW_ACTION_NAME']}${params.__ow_path}`, {
      method: params.__ow_method,
      headers: params.__ow_headers
    });
    const context = {
      runtime: {
        name: 'apache-openwhisk',
        args: arguments
      }
    };
    
    const response = await main(request, context);
    
    return {
      statusCode: response.status,
      headers: Array.from(response.headers.entries()).reduce((h, [header, value]) => {
        h[header] = value;
        return h;
      }, {}),
      body: await response.text()
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain"
      },
      body: e.message
    }
  }	
}

// Google
module.exports.google = async (req, res) => {
  try {
    const request = new Request(req.url);
    const context = {
      runtime: {
        name: 'googlecloud-functions',
        args: arguments
      }
    };
    
    const response = await main(request, context);
    
    res.status(response.status).send(await response.text());
    
  } catch (e) {
    res.status(500).send(e.message);
  }
};


// AWS
module.exports.lambda = async function(event) {
  try {
    const request = new Request(`https://${event.requestContext.domainName}${event.rawPath}${event.rawQueryString ? '?' : ''}${event.rawQueryString}`, {
      method: event.requestContext.http.method,
      headers: event.headers
    });
    const context = {
      runtime: {
        name: 'aws-lambda',
        args: arguments
      }
    };
    
    const response = await main(request, context);
    
    return {
      statusCode: response.status,
      headers: Array.from(response.headers.entries()).reduce((h, [header, value]) => {
        h[header] = value;
        return h;
      }, {}),
      body: await response.text()
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain"
      },
      body: e.message
    }
  }
};