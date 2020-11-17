const { main } = require("./main.js");

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  try {
    const request = new Request("http://example.com");
    const con = {
      runtime: {
        name: 'azure-functions',
        args: arguments
      }
    };
    
    const response = await main(request, con);
    
    context.res = {
      status: response.status,
      // headers: response.headers.entries().reduce((h, [header, value]) => {
      //   h[header] = value;
      //   return h;
      // }, {}),
      body: 'todo' // response.body.text()
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