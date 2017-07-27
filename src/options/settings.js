//取得登入設定
var loginInfo;
chrome.storage.local.get("LoginInfo", function (obj) {
	loginInfo = obj.LoginInfo;
});

//取得時間設定
var timeInfo;
chrome.storage.local.get("TimeInfo", function (obj) {
	timeInfo = obj.TimeInfo;
});

$(function () {

	if (loginInfo) {
		$('#UserName').val(loginInfo.UserName);
		$('#Password').val(loginInfo.Password);
	}

	if (timeInfo) {
		$('#OnTime').val(timeInfo.OnTime);
		$('#OffTime').val(timeInfo.OffTime);
	}

	$('#btnSave').click(function () {
		chrome.storage.local.set({
			'LoginInfo': {
				'UserName': $('#UserName').val(),
				'Password': $('#Password').val()
			},
			'TimeInfo': {
				'OnTime': $('#OnTime').val(),
				'OffTime': $('#OffTime').val()
			}
		}, function () {
			swal(
				'成功',
				'你的設定已儲存',
				'success'
			);
		});
	});

	$('#btnDelete').click(function () {
		swal({
			title: '確定要清除所有設定?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '確定',
			cancelButtonText: '取消'
		}).then(function () {
			chrome.storage.local.remove(["LoginInfo", "TimeInfo"], function () {
				$('#UserName').val();
				$('#Password').val();
				$('#OnTime').val();
				$('#OffTime').val();

				swal(
					'清除完成',
					'',
					'success'
				)
			});
		});
	});

});