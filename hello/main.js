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
  
  if (request.headers.get('content-type') === 'image/png' || request.headers.get('content-type') === 'application/octet-stream') {
    const arrb = await request.arrayBuffer();
    const buff = Buffer.from(arrb, 'utf-8');
    
    if (request.method === 'PUT') {
      return new Response(buff, {
        status: 201,
        headers: {
          'Content-Type': request.headers.get('content-type'),
          'X-Generator': 'hello world',
          'X-Length': arrb.byteLength
        }
      });
    }
    
    body += "\n" + buff.toString('base64') + ` (${arrb.byteLength} bytes)`
  } else {  
    body += "\n" + (request.body || 'GET requests do not have a body').toString();
  }
  return new Response(body, {
    status: 201,
    headers: {
      'Content-Type': 'text/plain',
      'X-Generator': 'hello world'
    }
  });
}