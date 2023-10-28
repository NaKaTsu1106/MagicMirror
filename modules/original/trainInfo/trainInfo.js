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
		var webSocket = new WebSocket("ws://127.0.0.1:5003");
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

        const interval = () => {
            self.sendNotification("faceRecogniton", {isUserDetected : false, isUserKnown : false, name : "名無し"});
        };
	},
	/*
    getTemplate: function () {
        return "trainInfo.njk";
	},
    */
    
	getDom: function () {
        if(!this.config.show) return document.createElement("div");
        var wrapper = document.createElement("div");
        if(this.info.status == "平常運転"){
            wrapper.innerHTML = "現在、遅延はありません。";
            return wrapper;
        }
        const createRow = (name,states,details) => {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.innerHTML = states;
            const cell2 = document.createElement("td");
            cell2.innerHTML = name;
            const cell3 = document.createElement("td");
            cell3.innerHTML = details;

            row.appendChild(cell2);
            row.appendChild(cell);
            row.appendChild(cell3);
            return row;
        };
        const table = document.createElement("table");
        {
            const rowName = document.createElement("tr");
            const lineName = document.createElement("th");
            lineName.innerHTML = "路線";
            const lineStatus = document.createElement("th");
            lineStatus.innerHTML = "遅延時間";
            const lineDetails = document.createElement("th");
            lineDetails.innerHTML = "詳細";
            rowName.appendChild(lineName);
            rowName.appendChild(lineStatus);
            rowName.appendChild(lineDetails);
            table.appendChild(rowName);
        }

        for(let i = 0; i < this.info.lines.length; i++){
            var line = this.info.lines[i];
            table.appendChild(createRow(line.name,line.status,line.details));
        }

        wrapper.appendChild(table);
        return wrapper;
    },

    notificationReceived: function(notification, payload, sender) {
        Log.info(notification);
        if(notification == "FACE_DETECT"){
            this.config.show = payload.isDetected;
            this.updateDom(1000);
        }
    }
    
});