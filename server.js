//create the actual notification
const notify = () => {
	chrome.notifications.create(
		'Notification'
		,{   
			type: 'basic', 
			iconUrl: './images/alert.png', 
			title: 'New Notification!', 
			message: 'There is a new notification'
		},
		() => {
			// add listner for tab focusing
			chrome.notifications.onClicked.addListener(queueName => {
				focusTab()
			})
		} 
	)
}

//listens for messages coming from content.js or popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.notify) {
    	sendResponse({success: true, message: "notification triggered"})
    	notify()
    }
})

//check open tabs and focus
const focusTab = () => {
	chrome.tabs.query({}, tabs => {
		tabs.map(tab => {
			if (tab.url.substr(0, 18) === "https://github.com"){
				chrome.tabs.update(tab.id, {"active": true}, tab => console.log("focused on tab: " + tab.id))
				return
			}
		})
	})
}

// intercept http calls and change/remove the headers to allow iframes from foreign origins
chrome.webRequest.onHeadersReceived.addListener(info => {
    const headers = info.responseHeaders; // original headers
    for (let i=headers.length-1; i>=0; --i) {
		let header = headers[i].name.toLowerCase()
		
        if (header === "content-security-policy") {
			headers[i].value = headers[i].value.replace('frame-src render.githubusercontent.com', 'frame-src https:')
		} else if (header == 'x-frame-options' || header == 'frame-options') {
			headers.splice(i, 1)
		}
    }
    // return modified headers
    return {responseHeaders: headers};
}, {
    urls: [ "https://github.com/*", "https://*.gitbook.io/*" ], // match all github and gitbook pages
}, ["blocking", "responseHeaders"])