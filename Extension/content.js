// content.js

let tooltip;

document.addEventListener('mouseup', (event) => {
    // A brief timeout helps ensure the selection is finalized before we read it.
    setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();

        // If a tooltip already exists, remove it to prevent conflicts.
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }

        // If new text has been selected, create a new tooltip.
        if (selectedText.length > 0) {
            createTooltip(event, selectedText);
        }
    }, 100);
});

function createTooltip(event, text) {
    tooltip = document.createElement('div');
    tooltip.id = 'ai-text-helper-tooltip';
    // Position the tooltip near the mouse cursor.
    tooltip.style.left = `${event.clientX + window.scrollX}px`;
    tooltip.style.top = `${event.clientY + window.scrollY + 15}px`;

    // Create the div where the AI's response will be displayed.
    const resultDiv = document.createElement('div');
    resultDiv.id = 'ai-text-helper-result';
    resultDiv.style.display = 'none'; // Initially hidden.

    // Pass the specific resultDiv to the handleAction function.
    const explainButton = document.createElement('button');
    explainButton.textContent = 'Explain This';
    explainButton.onclick = () => handleAction('explain', text, resultDiv);

    const summarizeButton = document.createElement('button');
    summarizeButton.textContent = 'Summarize';
    summarizeButton.onclick = () => handleAction('summarize', text, resultDiv);
    
    tooltip.appendChild(explainButton);
    tooltip.appendChild(summarizeButton);
    tooltip.appendChild(resultDiv);
    document.body.appendChild(tooltip);
}

function handleAction(action, text, resultDiv) {
    console.log(`Action triggered: ${action} for text: "${text.substring(0, 30)}..."`);

    resultDiv.textContent = 'Loading...';
    resultDiv.style.display = 'block';

    // **FINAL FIX:** Wrap the message sending in a try...catch block for maximum safety.
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            console.log("Sending message to background script...");
            chrome.runtime.sendMessage({ action, text }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Runtime error:", chrome.runtime.lastError.message);
                    resultDiv.textContent = `Error: The background script crashed. Check the Service Worker console.`;
                    return;
                }

                if (response && response.success) {
                    resultDiv.textContent = response.data;
                } else {
                    resultDiv.textContent = `Error: ${response ? response.error : 'Could not get a response.'}`;
                }
            });
        } else {
            throw new Error("Cannot connect to the extension's background script from this page.");
        }
    } catch (error) {
        console.error("Failed to send message:", error);
        resultDiv.textContent = `Error: ${error.message}`;
    }
}

// Add a listener to remove the tooltip if the user clicks elsewhere on the page.
document.addEventListener('mousedown', (event) => {
    // Check if the click is outside the currently active tooltip.
    if (tooltip && !tooltip.contains(event.target)) {
        tooltip.remove();
        tooltip = null;
    }
});
