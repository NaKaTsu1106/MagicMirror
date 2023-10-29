Module.register("MMM-chat", {
	// Default module config.
	defaults: {
		text: "さんぷる",
	},

	start: function() {
		var webSocket = new WebSocket("ws://127.0.0.1:5005");
        var self = this;

        webSocket.onopen = function(message){
            Log.info(webSocket);
        };
    
        webSocket.onclose = function(message){
            Log.info("Server Disconnect... OK");
        };

        webSocket.onerror = function(message){
            Log.info("error...");
        };

        webSocket.onmessage = function(message){

        };
	},
	
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;
        return wrapper;
    },
});
