var timeInfo;
var onTime, offTime;
chrome.storage.sync.get('TimeInfo', function (obj) {
	timeInfo = obj.TimeInfo;
	if (timeInfo) {
		onTime = parseInt(timeInfo.OnTime.replace(/:/g, "") + "00");
		offTime = parseInt(timeInfo.OffTime.replace(/:/g, "") + "00");
	} else {
		onTime = 090000;
		offTime = 180000;
	}
});

var dutyToday;
var onDuty, offDuty;

//設定計時器
chrome.alarms.create('timer', { when: Date.now(), periodInMinutes: 2 });
chrome.alarms.onAlarm.addListener(function (alarm) {
	var d = new Date();
	var now = parseInt(padLeft(d.getHours(), 2) + padLeft(d.getMinutes(), 2) + padLeft(d.getSeconds(), 2));

	chrome.storage.sync.get('DutyToday', function (obj) {
		dutyToday = obj.DutyToday;
		if (dutyToday) {
			onDuty = dutyToday.OnDuty;
			offDuty = dutyToday.OffDuty;
		} else {
			onDuty = false;
			offDuty = false;
		}
	});

	DailyReset();

	//邏輯:上班前五分鐘~下班時間前且未打上班 或 下班時間後且未打下班卡者，開網頁
	if ((now > onTime - 0500 && now < offTime && !onDuty) ||
		(now > offTime && !offDuty)) {
		chrome.tabs.create({
			url: 'https://femascloud.com/techlink/'
		});
	}
	console.log('now: ' + now + '\n' +
		'onTime: ' + onTime + '\n' +
		'offTime: ' + offTime + '\n' +
		'onDuty: ' + onDuty + '\n' +
		'offDuty: ' + offDuty);

});

//擴充元件小圖示點擊事件
chrome.browserAction.onClicked.addListener(function (activeTab) {
	var newURL = "https://femascloud.com/techlink";
	chrome.tabs.create({ url: newURL });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.command == 'closeTab') {
		chrome.tabs.query(
			{
				url: 'https://femascloud.com/techlink/*sers/*ain*'
			},
			function (tabs) {
				if (tabs) {
					chrome.tabs.remove(tabs[0].id);
				}
			}
		);
	}
});

chrome.storage.onChanged.addListener(function (changes, areaName) {
	console.log(changes);
});

//custom funcrions
function padLeft(str, length) {
	str = '' + str;
	if (str.length >= length)
		return str;
	else
		return padLeft("0" + str, length);
}

function padRight(str, length) {
	str = '' + str
	if (str.length >= length)
		return str;
	else
		return padRight(str + "0", length);
}

function DailyReset() {
	var dt = new Date().getDate();
	var lastDate;

	chrome.storage.sync.get('DayCheck', function (obj) {
		if (obj.DayCheck != 'undefined') {
			lastDate = obj.DayCheck.LastDate;
		} else {
			lastDate = 0;
		}
		console.log('lastDate: ' + lastDate + '\n' +
			'dt: ' + dt + '\n');

		if (lastDate == 'undefined' || lastDate != dt) {
			chrome.storage.sync.set({
				'DutyToday': {
					'OnDuty': false,
					'OffDuty': false
				}
			});
		}

		chrome.storage.sync.set({
			'DayCheck': {
				'LastDate': dt
			}
		});

	});
}

//function CheckHoliday() {
//	$.ajax({
//		url: 'http://data.taipei/opendata/datalist/apiAccess',
//		type: 'GET',
//		dataType: 'json',
//		data: {
//			scope: 'resourceAquire',
//			rid: 'c9b60d40-cb14-4796-9a6f-276fc1525128'
//		},
//		success: function (res) {
//			console.log(res);
//		},
//		error: function () {
//			alert('ajax error!');
//		}
//	});
//}
