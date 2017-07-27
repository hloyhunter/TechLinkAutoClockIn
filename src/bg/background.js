chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "https://femascloud.com/techlink";
    chrome.tabs.create({ url: newURL });
});