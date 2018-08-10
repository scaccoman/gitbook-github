// request notification permission on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Please use Chrome.');
    return
  }
  if (Notification.permission !== "granted")
    Notification.requestPermission()
})

//show chrome notification (send message to server.js)
const notifyMe = () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission()
  } else {
    chrome.runtime.sendMessage({notify: true}, (response) => {
      console.log(response)
    })
  }
}

// remove link and add iframe
const replaceContent = () => {
  const element = document.querySelector('.markdown-body.entry-content > p > a')
  const iframe = document.createElement('iframe')
  iframe.frameBorder = 0
  iframe.width = '100%'
  iframe.height = '500px'
  iframe.setAttribute("src", element.href)
  element.remove()
  document.querySelector('.markdown-body.entry-content > p').appendChild(iframe)
}

//add button to send notification
const addButton = () => {
  const element = document.querySelector('.BtnGroup.float-right')
  const button = document.createElement('a')
  button.id = 'personalButton'
  button.innerHTML = 'Notify'
  button.className = 'btn btn-sm BtnGroup-item'
  element.appendChild(button)
}

replaceContent()
addButton()
document.getElementById("personalButton").addEventListener("click", notifyMe)