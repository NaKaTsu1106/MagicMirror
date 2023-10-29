Module.register("faceRecognition", {
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
            if(data.isDetected){
                self.config.text = "こんにちは";
                self.sendNotification("FACE_DETECT", {isDetected : true });
            }else{
                self.config.text = "さようなら";
                self.sendNotification("FACE_DETECT", {isDetected : false });
            }
            self.updateDom(1000);
        };
	},
	
	getTemplate: function () {
        return "faceRecognition.njk";
	},
	

	getTemplateData: function () {
		return this.config;
	}
});
