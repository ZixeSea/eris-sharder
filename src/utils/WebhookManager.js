const axios = require('axios');

class WebhookManager {
	constructor() {
		this.requests = {};
		this.timeout = { t: null, ms: 0 };
	}
	Post(url, message) {
		if (!typeof url === 'string') {
			throw new Error(`expected URL(string), got ${typeof url}.`);
		}
		if (!typeof message === 'string' && !typeof message === 'object') {
			throw new Error(`expected message(string/object), got ${typeof url}.`);
		}

		if (this.requests[url]) this.requests[url].push(message);
		else this.requests[url] = [ message ];

		if (!this.timeout.t || this.timeout.t._called) {
			this.timeout.t = setTimeout(() => this.ExecuteRequests(), this.timeout.ms - Date.now() < 1 ? 1400 : this.timeout.ms - Date.now());

			this.timeout.ms = Date.now() + 10000;
		} 
	}
	ExecuteRequests() {
		for (let index = 0; index < Object.keys(this.requests).length; index++) {
			const messages = this.requests[Object.keys(this.requests)[index]].splice(0, 5);

			if (messages[0])
				axios({
					url: Object.keys(this.requests)[index],
					method: 'POST',
					headers: {
						'content-Type': 'application/json'
					},
					data: JSON.stringify({
						embeds: messages
					})
				}).catch((error) => {
					console.error(error);
				});

			if (messages.length === 0) {
				delete this.requests[Object.keys(this.requests)[index]];
			}
		}
		return;
	}
}

module.exports = new WebhookManager();
