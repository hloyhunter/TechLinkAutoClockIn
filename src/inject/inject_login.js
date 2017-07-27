var login;
chrome.storage.sync.get("LoginInfo", function (obj) {
	login = obj.LoginInfo;
});
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			var userName = document.getElementById('user_username');
			var userPasswd = document.getElementById('user_passwd');
			var loginButton = document.getElementById('s_buttom');

			if (!login.UserName || !login.Password) {
				alert("帳號或密碼尚未儲存");
			} else {
				userName.value = login.UserName;
				userPasswd.value = login.Password;
				loginButton.click();
			}
		// ----------------------------------------------------------

	}
	}, 10);
});