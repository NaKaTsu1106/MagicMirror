const NodeHelper = require("node_helper");
const Log = require("logger");
module.exports = NodeHelper.create({
	// Override start method.
	start: function () {
		Log.log(`Starting node helper for: ${this.name}`);
		this.fetchers = [];
        Log.info(this.config);
	},
});