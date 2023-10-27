/* MagicMirror²
 * Module: HelloWorld
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("timetable", {
	// Default module config.
	defaults: {
		text: "挑戦型プロジェクト!"
	},

    start: function() {
		var webSocket = new WebSocket("ws://127.0.0.1:5004");
        var self = this;

        webSocket.onopen = function(message){
            Log.info(webSocket);
            webSocket.send("send");
        };
    
        webSocket.onclose = function(message){
            Log.info("Server Disconnect... OK");
        };

        webSocket.onerror = function(message){
            Log.info("error...");
        };

        webSocket.onmessage = function(message){
            Log.info(message.data);
            self.config.text = message.data;
            self.updateDom(1000);
        };
	},

	getTemplate: function () {
		return "timetable.njk";
	},

	getTemplateData: function () {
		return this.config;
	}
});
