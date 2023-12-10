/* MagicMirror²
 * Module: HelloWorld
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("MMM-timeTable", {
	// Default module config.
	defaults: {
		text: "挑戦型プロジェクト!",
        show: true,
	},
    jsonData: null,
    

    start: function() {
        this.sendSocketNotification("REQUEST","097");
        var webSocket = new WebSocket("ws://127.0.0.1:5005");
        var self = this;

        webSocket.onopen = function(message){
            Log.info(webSocket);
            webSocket.send(JSON.stringify({type: 'CONNECT', name: self.name}));
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
            var data = JSON.parse(message.data);

            
            Log.info(data.type);
            if(data.type == "CALL"){
                webSocket.send(JSON.stringify({type: 'RESPONSE',name:"timeTable",data: JSON.stringify(self.extractTimetable(self.jsonData, data.dayNumber))}));
            }
            self.updateDom(1000);
        };
	},
    extractTimetable :function (data, dayNumber) {
        // Mapping numbers to days
        const days = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
        const day = days[dayNumber - 1];
    
        // Check if the day number is valid
        if (!day) {
            console.error("Invalid day number. Please provide a number from 1 to 6.");
            return;
        }
    
        // Extracting the timetable for the specified day
        const timetable = [];
        data.forEach(period => {
            const classInfo = period.classes[day];
            // Only add the class if it exists for that day
            if (classInfo && classInfo.class_name) {
                timetable.push({
                    period: period.period,
                    class_name: classInfo.class_name,
                });
            }
        });
    
        return timetable;
    },

	getDom: function () {
        if(!this.config.show){
            return document.createElement("div");
        }else{
            return this.createTableDom(this.jsonData);
        }
        
	},

    createTableDom: function(timetableData){
        if(timetableData == null) return document.createElement("div");

        // テーブル要素を作成
        const table = document.createElement('table');
        table.setAttribute('border', '1');

        // 授業が存在する曜日を特定する
        const activeDays = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"].filter(day => {
            return timetableData.some(entry => entry.classes[day].class_name);
        });

        // ヘッダー行を作成
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        [""].concat(activeDays).forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 各行（時間帯）に対して
        timetableData.forEach(entry => {
            // その時間帯のすべての曜日に授業がない場合、行をスキップ
            const hasClasses = Object.values(entry.classes).some(classInfo => classInfo.class_name);
            if (!hasClasses) return;

            const tr = document.createElement('tr');

            // 時間帯セルを追加
            const periodCell = document.createElement('td');
            periodCell.textContent = entry.period + "時限";
            tr.appendChild(periodCell);

            // 各曜日のデータをセルに追加
            for (const day of activeDays) {
                const td = document.createElement('td');
                const classInfo = entry.classes[day];
                if (classInfo.class_name) {
                    td.innerHTML = `
                        <strong>${classInfo.class_name}</strong><br>
                        場所: ${classInfo.location}<br>
                    `;
                }
                tr.appendChild(td);
            }

            table.appendChild(tr);
        });
        return table;
    },

    notificationReceived: function(notification, payload, sender) {
        if(notification == "FACE_DETECT"){
			if(payload.isDetected != this.config.show){
            	this.config.show = payload.isDetected;
            	this.updateDom(1000);
			}
        }
    },
    // Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
        if(notification == "RESPONSE"){
            this.jsonData = payload;
            this.updateDom(1000);
        }
	},
});

