const { Response } = require("node-fetch");

module.exports.main = async function(request, context) {
  let body = "hello world\n\n" + JSON.stringify(context, null, "  ");
  
  body += "\n" + request.url;
  body += "\n" + request.method;
  
  return new Response(body, {
    status: 201,
    headers: {
      'Content-Type': 'text/plain',
      'X-Generator': 'hello world'
    }
  });
}