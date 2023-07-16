const detectButton = document.getElementById('detect-propaganda-btn');

detectButton.addEventListener('click', function() {
    // Send a message to the active tab to request the selected text
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' });
    });
  });

  // Retrieve the selected text / analysed text from the model and do stuff with it
  browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.text) {
        alert(message.text);
    }
  });