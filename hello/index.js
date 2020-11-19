const { main } = require("./main.js");
const { Request } = require("node-fetch");
/*
 * Universal Wrapper for serverless functions
 */

/**
 * Checks if the content type is binary.
 * @param {string} type - content type
 * @returns {boolean} {@code true} if content type is binary.
 */
function isBinary(type) {
  if (/text\/.*/.test(type)) {
    return false;
  }
  if (/.*\/javascript/.test(type)) {
    return false;
  }
  if (/.*\/.*json/.test(type)) {
    return false;
  }
  if (/.*\/.*xml/.test(type)) {
    return /svg/.test(type); // openwhisk treats SVG as binary
  }
  return true;
}

// Azure
module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  try {
    const request = new Request(req.url, {
      method: req.method,
      headers: req.headers,
      // azure only detects binaries when the mime type is a/o-s so no image/png or friends
      body: req.headers['content-type']==='application/octet-stream' ? req.body : req.rawBody,
    });
    
    const con = {
      runtime: {
        name: 'azure-functions',
        region: process.env.Location,
      },
      func: {
        name: context.executionContext.functionName,
        version: undefined, // seems impossible to get
        app: process.env.WEBSITE_SITE_NAME,
      },
      invocation: {
        id: context.invocationId,
        deadline: undefined, 
      },
      env: process.env,
      debug: Object.keys(req),
      types: [typeof req.body, typeof req.rawBody],
      headers: req.headers,
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
    const env = { ...process.env };
    delete env.__OW_API_KEY;
    const request = new Request(`https://${params.__ow_headers['x-forwarded-host'].split(',')[0]}/api/v1/web${process.env['__OW_ACTION_NAME']}${params.__ow_path}${params.__ow_query ? '?' : ''}${params.__ow_query}`, {
      method: params.__ow_method,
      headers: params.__ow_headers,
      body: isBinary(params.__ow_headers['content-type']) ? Buffer.from(params.__ow_body, 'base64') : params.__ow_body,
    });
    
    const [namespace, ...names] = process.env.__OW_ACTION_NAME.split('/');
    
    delete params.__ow_method;
    delete params.__ow_query;
    delete params.__ow_body;
    delete params.__ow_headers;
    delete params.__ow_path;
    
    
    const context = {
      runtime: {
        name: 'apache-openwhisk',
        region: process.env.__OW_REGION,
      },
      func: {
        name: names.join('/'),
        version: process.env.__OW_ACTION_VERSION,
        app: namespace,
      },
      invocation: {
        id: process.env.__OW_ACTIVATION_ID,
        deadline: Number.parseInt(process.env.__OW_DEADLINE, 10), 
      },
      env: { ...params, ...process.env }
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
    const request = new Request(`https://${req.hostname}/${process.env.K_SERVICE}${req.originalUrl}`, {
      method: req.method,
      headers: req.headers,
      // google magically does the right thing here
      body: req.rawBody,
    });
    
    const [ subdomain ] = req.headers.host.split('.');
    const [ country, region, ...servicename ] = subdomain.split('-');
    
    const context = {
      runtime: {
        name: 'googlecloud-functions',
        region: `${country}${region}`,
      },
      func: {
        name: process.env.K_SERVICE,
        version: process.env.K_REVISION,
        app: servicename.join('-'),
      },
      invocation: {
        id: req.headers['function-execution-id'],
        deadline: Number.parseInt(req.headers['x-appengine-timeout-ms'], 10) + Date.now(), 
      },
      env: process.env
    };
    
    const response = await main(request, context);
    
    Array.from(response.headers.entries()).reduce((r, [header, value]) => {
      return r.set(header, value);
    }, res.status(response.status)).send(await response.text());
  } catch (e) {
    res.status(500).send(e.message);
  }
};


// AWS
module.exports.lambda = async function(event, context) {
  try {
    const request = new Request(`https://${event.requestContext.domainName}${event.rawPath}${event.rawQueryString ? '?' : ''}${event.rawQueryString}`, {
      method: event.requestContext.http.method,
      headers: event.headers,
      body: event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body,
    });
    const con = {
      runtime: {
        name: 'aws-lambda',
        region: process.env.AWS_REGION,
      },
      func: {
        name: context.functionName,
        version: context.functionVersion,
        app: event.requestContext.apiId,
      },
      invocation: {
        id: context.awsRequestId,
        deadline: Date.now() + context.getRemainingTimeInMillis()
      },
      env: process.env
    };
    
    const response = await main(request, con);
    
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