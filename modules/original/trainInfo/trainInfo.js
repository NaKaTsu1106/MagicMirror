Module.register("trainInfo", {
	// Default module config.
	defaults: {
		text: "trainInfo",
        show: true,
	},
    info:{
        "status": "遅延あり",
        "lines": [
          {
            "name": "山手線",
            "status": "平常運転",
            "details": "事故・遅延情報はありません",
          },
          {
            "name": "京浜東北根岸線",
            "status": "平常運転",
            "details": "事故・遅延情報はありません",
          },
          {
            "name": "信越本線[高崎～横川]",
            "status": "平常運転",
            "details": "事故・遅延情報はありません",
          },
        ]
      },

	start: function() {
        var self = this;
        
		var webSocket = new WebSocket("ws://111.217.228.107:4");
        

        webSocket.onopen = function(message){
            Log.info(webSocket);
            webSocket.send("東武スカイツリーライン〜久喜・南栗橋");
        };
    
        webSocket.onclose = function(message){
            Log.info("Server Disconnect... OK");
        };

        webSocket.onerror = function(message){
            Log.info("error...");
        };

        webSocket.onmessage = function(message){
            Log.info(message.data);
            self.info = JSON.parse(message.data);
            self.updateDom(1000);
        };       
	},
    
	getDom: function () {
        if(!this.config.show) return document.createElement("div");
        var wrapper = document.createElement("div");
        if(this.info.status == "平常運転"){
            wrapper.innerHTML = "現在、遅延はありません。";
            return wrapper;
        }
        const createRow = (name,states) => {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.innerHTML = states;
            const cell2 = document.createElement("td");
            cell2.innerHTML = name;

            row.appendChild(cell2);
            row.appendChild(cell);
            return row;
        };
        const table = document.createElement("table");
        {
            const rowName = document.createElement("tr");
            const lineName = document.createElement("th");
            lineName.innerHTML = "路線";
            const lineStatus = document.createElement("th");
            lineStatus.innerHTML = "運転状況";
            rowName.appendChild(lineName);
            rowName.appendChild(lineStatus);
            table.appendChild(rowName);
        }

        for(let i = 0; i < this.info.length; i++){
            var line = this.info[i];
            //if(line.status == "平常運転") continue;
            table.appendChild(createRow(line.name,line.status));
        }

        wrapper.appendChild(table);
        return wrapper;
    },

    notificationReceived: function(notification, payload, sender) {
        if(notification == "FACE_DETECT"){
			if(payload.isDetected != this.config.show){
            	this.config.show = payload.isDetected;
            	this.updateDom(1000);
			}
        }
    }
    
});
