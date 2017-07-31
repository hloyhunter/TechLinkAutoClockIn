var timeInfo;
var onTime, offTime;
chrome.storage.local.get('TimeInfo', function (obj) {
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

	chrome.storage.local.get('DutyToday', function (obj) {
		dutyToday = obj.DutyToday;
		if (dutyToday) {
			onDuty = dutyToday.OnDuty;
			offDuty = dutyToday.OffDuty;
		} else {
			onDuty = false;
			offDuty = false;
		}
	});

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

	//每晚即將換日時，已打卡都轉為false
	if (now < 000500 || now > 235500) {
		chrome.storage.local.set({
			'DutyToday': {
				'OnDuty': false,
				'OffDuty': false
			}
		});
	}
});

//擴充元件小圖示點擊事件
chrome.browserAction.onClicked.addListener(function (activeTab) {
	var newURL = "https://femascloud.com/techlink";
	chrome.tabs.create({ url: newURL });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.command == 'closeTab') {
		chrome.tabs.query(
			{ active: true },
			function (tabs) {
				if (tabs) {
					chrome.tabs.remove(tabs[0].id);
				}
			}
		);
	}
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
