var anno = {};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Messaging 1
  if (request.action === "NewTab") {
    var newURL = "https://happy-annotation-server.herokuapp.com/";
    chrome.tabs.create({ url: newURL });
    sendResponse({ message: "A new tab created with URL: " + newURL });
  }
});