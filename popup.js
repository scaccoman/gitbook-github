//create notification
document.getElementById("notify").addEventListener("click", function(){
    chrome.runtime.sendMessage({notify: true}, (response) => {
        console.log(response)
    })
})