Module.register("MMM-trainInfo", {
	// Default module config.
	defaults: {
		text: "trainInfo",
        show: true,
	},
    require_info: false,
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
        
	    var webSocket_info = new WebSocket("ws://111.217.228.107:4");
        var webSocket_MM = new WebSocket("ws://127.0.0.1:5005");
        

        webSocket_info.onopen = function(message){
            Log.info(webSocket_info);
            webSocket_info.send("東武スカイツリーライン〜久喜・南栗橋");
        };
    
        webSocket_info.onclose = function(message){
            Log.info("Server Disconnect... OK");
        };

        webSocket_info.onerror = function(message){
            Log.info("error...");
        };

        webSocket_info.onmessage = function(message){
            Log.info(message.data);
            self.info = JSON.parse(message.data);
            if(self.require_info){
                webSocket_MM.send(JSON.stringify({type: 'RESPONSE',name:"train",data: JSON.stringify(self.info)}));
            }
            self.require_info = false;
            self.updateDom(1000);
        }; 
        
        webSocket_MM.onopen = function(message){
            Log.info(self.webSocket_info);
            webSocket_MM.send(JSON.stringify({type: 'CONNECT', name: self.name}));
            self.hide();
        };
    
        webSocket_MM.onclose = function(message){
            Log.info("Server Disconnect... OK");
        };

        webSocket_MM.onerror = function(message){
            Log.info("error...");
        };

        webSocket_MM.onmessage = function(message){
            self.show();
            Log.info(message)
            var data = JSON.parse(message.data);
            Log.info(data.type);
            if(data.type == "CALL"){
                self.require_info = true;
                webSocket_info.send(data.lineName);
            }
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
            if(!payload.isDetected){
                this.hide();
            }
        }
    },
    
});
