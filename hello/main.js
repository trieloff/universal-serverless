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
  
  return new Response(body, {
    status: 201,
    headers: {
      'Content-Type': 'text/plain',
      'X-Generator': 'hello world'
    }
  });
}