Module.register("MMM-chat", {
	// Default module config.
	defaults: {
		text: "話しかけてください",
	},

	start: function() {
		var webSocket = new WebSocket("ws://127.0.0.1:5005");
        var self = this;

        webSocket.onopen = function(message){
            Log.info(webSocket);
            webSocket.send(JSON.stringify({type: 'CONNECT', name: 'MMM-chat'}));
            self.hide();
        };
    
        webSocket.onclose = function(message){
            Log.info("Server Disconnect... OK");
        };

        webSocket.onerror = function(message){
            Log.info("error...");
        };

        webSocket.onmessage = function(message){
            self.show();
            Log.info(message);
            var data = JSON.parse(message.data);
            self.config.text = data.text;
            self.updateDom(1000);
        };
	},
	
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;
        wrapper.style.fontSize = "xx-large";
        return wrapper;
    },
});
