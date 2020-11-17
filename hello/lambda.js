const { main } = require('./main.js');
const { Request } = require("node-fetch");

exports.handler = async function(event) {
	try {
		const request = new Request(`https://${event.requestContext.domainName}${event.rawPath}${event.rawQueryString ? '?' : ''}${event.rawQueryString}`, {
			method: event.requestContext.http.method,
			headers: event.headers
		});
		const context = {
			runtime: {
				name: 'aws-lambda',
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
};