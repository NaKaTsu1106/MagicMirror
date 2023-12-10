const NodeHelper = require("node_helper");
const Log = require("logger");
module.exports = NodeHelper.create({
	// Override start method.
	start: function () {
		Log.log(`Starting node helper for: ${this.name}`);
	},
	// Override socketNotificationReceived received.
	socketNotificationReceived: function (notification, payload) {
		if(notification === "REQUEST"){
			const data = require("./" + payload + ".json");
			this.sendSocketNotification("RESPONSE", data);
		}
	},
});