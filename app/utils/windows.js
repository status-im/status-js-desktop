export const openBrowserWindow = url => {
  window.open(url, '_blank', 'nodeIntegration=no');
}

export const addWindowEventListeners = (sendMessage) => {
  window.addEventListener('message', function (msg) {
    console.log('message', msg)
    if (msg.source === window.parent) {
      console.log(msg.data)
    }

    if (msg.data && msg.data.type && msg.data.type === 'whisperMsg') {
      sendMessage(msg.data.msg)
    }
  })
}
