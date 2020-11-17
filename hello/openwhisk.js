const { main } = require('./main');

module.exports.main = async function main(params) {
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
			// headers: response.headers.entries().reduce((h, [header, value]) => {
			// 	h[header] = value;
			// 	return h;
			// }, {}),
			body: 'todo' // response.body.text()
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