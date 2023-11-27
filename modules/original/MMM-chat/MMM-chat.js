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
            Log.info(message);
            
            var data = JSON.parse(message.data);
            Log.info(data);
            if(data.type == 'CALL'){
                if(data.name == "train"){
                    
                }
            }
            if(data.type == 'TEXT'){
                self.config.text = data.text;
                self.updateDom(1000);
            }
        };
	},
	
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;
        wrapper.style.fontSize = "xx-large";
        return wrapper;
    },
});
