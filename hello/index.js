const { main } = require("./main.js");
const { Request } = require("node-fetch");

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