Module.register("faceRecogniton", {
	// Default module config.
	defaults: {
		text: "faceRecogniton running...",
	},

	start: function() {
		var webSocket = new WebSocket("ws://127.0.0.1:5001");
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
            var data = JSON.parse(message.data);
            Log.info(data.isDetected);
            if(data.isDetected){
                self.config.text = "こんにちは";
            }else{
                self.config.text = "さようなら";
            }
            self.updateDom(1000);
        };

        const interval = () => {
            self.sendNotification("faceRecogniton", {isUserDetected : false, isUserKnown : false, name : "名無し"});
        };
	},
	
	getTemplate: function () {
        return "faceRecogniton.njk";
	},
	

	getTemplateData: function () {
		return this.config;
	}
});
