// background.js

console.log("AI Text Helper background script loaded successfully.");

// IMPORTANT: Ensure your API key is pasted here.
const API_KEY = "AIzaSyCzU5Tise8QudM1wpHiU7KvOMsGSwwEM4E"; // Your API key goes here!


const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
;

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background script received a message:", request);

    if (request.text && API_KEY) {
        let prompt;
        if (request.action === 'explain') {
            prompt = `Explain the following text in a clear and concise way: "${request.text}"`;
        } else if (request.action === 'summarize') {
            prompt = `Summarize the key points of the following text: "${request.text}"`;
        } else {
            sendResponse({ success: false, error: 'Unknown action' });
            return false; // Keep channel open for async response
        }
        
        console.log("Sending prompt to Gemini:", prompt);

        // **FINAL FIX:** The entire async operation is now wrapped to ensure sendResponse is called correctly.
        (async () => {
            try {
                const data = await callGeminiAPI(prompt);
                console.log("Received data from Gemini:", data);
                sendResponse({ success: true, data: data });
            } catch (error) {
                console.error("Error in async operation:", error);
                sendResponse({ success: false, error: error.message });
            }
        })();

        return true; // Return true to indicate you will be sending a response asynchronously
    } else if (!API_KEY) {
        const errorMsg = "API Key is missing in background.js";
        console.error(errorMsg);
        sendResponse({ success: false, error: errorMsg });
    }
});

async function callGeminiAPI(prompt) {
    console.log("Attempting to call the Gemini API...");
    try {
        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Full API Response:", JSON.stringify(data, null, 2));

        if (data.candidates && data.candidates.length > 0) {
            const firstCandidate = data.candidates[0];
        
            // Case 1: New structured format
            if (firstCandidate.content && firstCandidate.content.parts && firstCandidate.content.parts.length > 0) {
                return firstCandidate.content.parts[0].text;
            }
        
            // Case 2: Flat output_text field
            if (firstCandidate.output_text) {
                return firstCandidate.output_text;
            }
        }

        
        if (data.promptFeedback && data.promptFeedback.blockReason) {
            const reason = data.promptFeedback.blockReason;
            console.warn(`Request was blocked by API. Reason: ${reason}`);
            return `The request was blocked due to safety settings. Reason: ${reason}`;
        }

        throw new Error("Invalid response structure from API.");

    } catch (error) {
        console.error("Fetch call to Gemini API failed:", error);
        throw error;
    }
}
