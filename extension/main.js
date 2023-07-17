// Author: Daniel G. Jones - ClarifAI - University of Zurich

// Request properties
const apiKey = '<OPENAI_API_KEY>';
const endpoint = 'https://api.openai.com/v1/chat/completions';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
};

// HTML elements
const getTextButton = document.getElementById('get-selectedtext-button');
const detectButton = document.getElementById('detect-propaganda-btn');
const textOutput = document.getElementById('text-selection');
const detectOutput = document.getElementById('propaganda-output');

// Send a message to the active tab to request the selected text
// Listener set up in the injected clarifai.js script
getTextButton.addEventListener('click', function() {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' });
    });
});

// Retrieve the text selection and add it to the editable textbox
// Sometimes doesn't manage to obtain the text - e.g., if inside of a textarea...?
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.text) {
        textOutput.textContent = message.text;
    } else {
        alert('No text selected - try copying it in');
    }
});

// Send the text to the model and display the results
detectButton.addEventListener('click', function() {
    let promptTemplate = `
    The following are a list of propaganda techniques and their definitions:

    Name calling - Attack an object/subject of the propaganda with an insulting label.
    Repetition - Repeat the same message over and over.
    Slogans - Use a brief and memorable phrase.
    Appeal to fear - Support an idea by instilling fear against other alternatives.
    Doubt - Questioning the credibility of someone/something.
    Exaggeration / minimization - Exaggerate or minimize something.
    Flag-Waving - Appeal to patriotism or identity.
    Loaded Language - Appeal to emotions or stereotypes.
    Reduction ad hitlerum - Disapprove an idea suggesting it is popular with groups hated by the audience.
    Bandwagon - Appeal to the popularity of an idea.
    Causal oversimplification - Assume a simple cause for a complex event.
    Obfuscation, intentional vagueness - Use deliberately unclear and obscure expressions to confuse the audience.
    Appeal to authority - Use authority's support as evidence.
    Black & white fallacy - Present only two options among many.
    Thought terminating clichés - Phrases that discourage critical thought and meaningful discussions.
    Red herring - Introduce irrelevant material to distract.
    Straw men - Refute argument that was not presented.
    Whataboutism - Charging an opponent with hypocrisy.

    For each of the techniques and according to its definition, answer with a yes or no if the technique is being used in the following text and with an example from the text if present. This should take the exact form of: 'Propaganda technique - Yes or No - Explanation'.

    ${textOutput.textContent}

    Lastly, give a final verdict on whether the text is propaganda stating a percentage likelihood on the text being propaganda followed by a detailed explanation. This should take the form of: 'Verdict - Number% - Explanation'
    `;

    const data = JSON.stringify({
        'model': 'gpt-3.5-turbo',
        'messages': [{'role': 'user', 'content': promptTemplate}],
        'temperature': 0
      });
      detectOutput.textContent = 'Detection in progress, please wait...';
      fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: data
      })
      .then(response => response.json())
      .then(result => {
        detectOutput.textContent = result.choices[0].message.content;
      })
      .catch(error => {
        console.error('Error:', error);
      });

});
