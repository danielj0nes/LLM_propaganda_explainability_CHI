// Check for when the 'detect propaganda' button is clicked
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'getSelectedText') {
        const selectedText = window.getSelection().toString();
        
        // Return the text selection to the background script
        // Still to do here is make the request to the model to get the analysis
        browser.runtime.sendMessage({ text: selectedText });
    }
});