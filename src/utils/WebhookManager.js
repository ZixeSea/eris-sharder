const axios = require('axios');

class WebhookManager {
	constructor() {
		this.requests = {};
		this.timeout = null;
	}
	Post(url, message) {
		if (!typeof url === 'string') {
			throw new Error(`expected URL(string), got ${typeof url}.`);
		}
		if (!typeof message === 'string' && !typeof message === 'object') {
			throw new Error(`expected message(string/object), got ${typeof url}.`);
		}

		if (this.requests[url]) {
			this.requests[url].push(message);
		} else {
			this.requests[url] = [ message ];
		}
		if (!this.timeout) {
			this.ExecuteRequests();
			this.timeout = Date.now() + 10000;
		} else {
			if (this.timeout - Date.now() < 1) {
				this.ExecuteRequests();
				this.timeout = Date.now() + 10000;
			} else
				setTimeout(() => {
					this.ExecuteRequests();
					this.timeout = Date.now() + 10000;
				}, this.timeout - Date.now());
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

			console.log(messages);

			if (messages.length === 0) {
				delete this.requests[Object.keys(this.requests)[index]];
			}
		}
		return;
	}
}

module.exports = new WebhookManager();
