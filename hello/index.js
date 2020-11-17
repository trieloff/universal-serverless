const { main } = require("./main.js");

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  
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
    headers: response.headers.entries().reduce((h, [header, value]) => {
      h[header] = value;
      return h;
    }, {}),
    body: response.body.text()
  };
}