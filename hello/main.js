const { Response } = require("node-fetch");

module.exports.main = async function(request, context) {
  let body = "hello world\n\n" + JSON.stringify(context, null, "  ");
  
  return new Response(body, {
    status: 201
  });
}