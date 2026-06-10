# ✈️ FlyBie Airlines - AI Booking Assistant

Welcome to the FlyBie Airlines project! This is a modern, responsive flight booking web application powered by **React**, **Vite**, and **Azure OpenAI**. It features a stunning landing page and a real-time conversational UI that integrates directly with the **Travelport uAPI** to fetch live flight pricing and schedules.

## ✨ Features
* **Landing Page:** Beautiful, animated landing page built with modern CSS and Lucide React icons.
* **Conversational Booking:** Talk to the Azure AI assistant to book your flights using natural language.
* **Auto-Filling Smart Widget:** The chat widget seamlessly extracts Origin, Destination, and Dates from your conversation and auto-fills the inputs.
* **Live Travelport Integration:** Searches for live global flights via the Travelport B2B Gateway using native SOAP XML API calls.
* **CORS Proxy:** Bypasses enterprise API CORS blocks using a local Vite proxy.

---

## 🚀 Getting Started

If you have downloaded or cloned this repository, follow these steps to get the application running on your local machine.

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies
Open your terminal, navigate to the project folder, and run:
```bash
npm install
```

### 3. Setup Environment Variables
This application uses Azure OpenAI to power the chatbot. Since API keys should never be committed to GitHub, you need to create your own configuration file.

Create a new file named `.env` in the root of the project folder and add your Azure credentials:

```env
VITE_AZURE_OPENAI_ENDPOINT="https://<your-resource-name>.services.ai.azure.com"
VITE_AZURE_OPENAI_API_KEY="your-api-key-here"
VITE_AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4"
```

### 4. Start the Development Server
Run the following command to boot up the application:
```bash
npm run dev
```

### 5. Open the Application
Once the server starts, open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173/`).

Enjoy exploring FlyBie! 🛫
