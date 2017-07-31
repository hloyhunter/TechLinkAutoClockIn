var timeInfo;
chrome.storage.local.get('TimeInfo', function (obj) {
	timeInfo = obj.TimeInfo;
});

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading

			var onTime, offTime;
			if (timeInfo) {
				onTime = parseInt(timeInfo.OnTime.replace(/:/g, "") + "00");
				offTime = parseInt(timeInfo.OffTime.replace(/:/g, "") + "00");
			} else {
				onTime = 090000;
				offTime = 180000;
			}

			var now = parseInt($("#time").html().replace(/:/g, ""));
			var onDuty = $('.textBlue').first().html().trim().replace(/&nbsp;/g, '') == '' ? false : true;
			var offDuty = $('.textBlue').last().html().trim().replace(/&nbsp;/g, '') == '' ? false : true;

			chrome.storage.local.set({
				'DutyToday': {
					'OnDuty': onDuty,
					'OffDuty': offDuty
				}
			});

			if (now > onTime - 500 && now < offTime && !onDuty) {
				$('input[type=submit][value=0900]').click();
			} else if (now > offTime && !offDuty) {
				$('input[type=submit][value=1800]').click();
			}

			WaitCloseTab(5);
			// ----------------------------------------------------------

		}
	}, 10);
});

function WaitCloseTab(seconds) {
	setTimeout(function () {
		chrome.runtime.sendMessage({ command: "closeTab" }, function (response) {
		});
	}, seconds * 1000);
}