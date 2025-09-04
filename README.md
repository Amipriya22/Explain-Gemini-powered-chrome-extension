## The Problem
*On mobile devices, you can easily highlight text in your browser to get an instant Google search, definition, or explanation. This seamless flow of information is a powerful tool for quick lookups and learning. However, this fluid experience is completely missing from desktop browsers, forcing users to manually copy, open a new tab, paste, and search—a clunky and disruptive process*

## The Solution: Select Sense
**Select Sense** is a lightweight Chrome extension that bridges this gap. It brings the intelligent, context-aware functionality of mobile browsers right to your PC.

Now, you can simply highlight any text on any webpage, and a clean, unobtrusive tooltip will instantly appear, offering to:

* **Explain This**: Get a clear, concise explanation of the selected text, powered by Google's Gemini AI.

* **Summarize**: Condense long passages into key points for quick understanding.

This turns your desktop browser into a more powerful tool for research, learning, and productivity.

## Features

* **Universal Compatibility:** Works on any webpage.
* **Instant AI Actions:** Get explanations and summaries without leaving the page.
* **Seamless Interface:** A simple tooltip appears right where you need it.
* **Powered by Gemini:** Leverages Google's advanced AI for high-quality responses.

## Getting Started

To install and run this extension locally, follow these steps:

1.  **Download the Files:** Make sure you have all the project files (`manifest.json`, `content.js`, `background.js`, `styles.css`) in a single folder.
2.  **Add Your API Key:**
    * Open the `background.js` file.
    * Find the line `const API_KEY = "";`.
    * Paste your Google Gemini API key between the quotes. You can get a free key from [Google AI Studio](https://aistudio.google.com/).
3.  **Load the Extension in Chrome:**
    * Open your Chrome browser and navigate to `chrome://extensions`.
    * Enable **"Developer mode"** using the toggle in the top-right corner.
    * Click the **"Load unpacked"** button.
    * Select the folder containing the extension files.

The **Select Sense** icon should now appear in your extensions toolbar, and it will be active on all your pages!
