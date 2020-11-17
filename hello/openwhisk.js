const { main } = require('./main');
const { Request } = require("node-fetch");

module.exports.main = async function(params) {
	try {
		const request = new Request("http://example.com");
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