const axios = require('axios');

class WebhookManager {
	constructor() {
		this.requests = new Map();
		this.timeout;
	}
	Post(url, message) {
		if (!typeof url === 'string') {
			throw new Error(`expected URL(string), got ${typeof url}.`);
		}
		if (!typeof message === 'object') {
			throw new Error(`expected message(object), got ${typeof message}.`);
		}

		if (this.requests.get(url)) {
			this.requests.get(url).embeds.push(message);
		} else this.requests.set(url, { embeds: [ message ], endpoint: url });

		if (!this.timeout) this.timeout = setTimeout(() => this.ExecuteRequests(), 10000);
	}
	ExecuteRequests() {
		this.timeout = null;

		this.requests.forEach((request) => {
			const embeds = request.embeds.splice(0, 5);

			if (embeds[0]) {
				axios({
					url: request.endpoint,
					method: 'POST',
					headers: {
						'content-Type': 'application/json'
					},
					data: JSON.stringify({
						embeds: embeds
					})
				}).catch((error) => {
					console.error(error);
				});
			}

			if (request.embeds.length === 0) {
				this.requests.delete(request.endpoint);
			} else if(!this.timeout) this.timeout = setTimeout(() => this.ExecuteRequests(), 10000);
		});
	}
}

module.exports = new WebhookManager();