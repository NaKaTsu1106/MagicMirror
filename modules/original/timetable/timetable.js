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
    jsonData: null,

    start: function() {
        this.sendSocketNotification("REQUEST","097");
	},

	getDom: function () {
        if(this.jsonData == null){
            const wrapper = document.createElement("div");
            return wrapper;
        }
        return this.createTableDom(this.jsonData);
	},

    createTableDom: function(timetableData){
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

	getTemplateData: function () {
		return this.config;
	},
    // Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
        this.jsonData = payload;
        this.updateDom(1000);
	},
});
