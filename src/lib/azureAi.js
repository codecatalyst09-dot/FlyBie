// FlyBie Azure OpenAI Integration

const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_DEPLOYMENT_NAME = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;
const API_VERSION = '2024-02-15-preview'; // Update if needed

const SYSTEM_PROMPT = `
You are FlyBie Booking Assistant, an AI-powered flight booking agent.
Your goal is to help users search and book flights through natural conversation.

Responsibilities:
1. Understand travel requests.
2. Extract travel entities using NER (Origin, Destination, Departure Date, Passengers).
3. Ask follow-up questions for missing information.
4. Maintain conversation context.
5. Use a friendly airline customer service tone.

Required information before flight search:
- Origin
- Destination
- Departure Date
- Passenger Count

When you have ALL required information, respond with exactly: [TRIGGER_SEARCH] and summarize the request.
`;

export async function callAzureOpenAI(messagesHistory) {
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !AZURE_OPENAI_DEPLOYMENT_NAME) {
    return {
      error: true,
      text: "Azure OpenAI is not configured yet. Please add your credentials to the .env file."
    };
  }

  const url = AZURE_OPENAI_ENDPOINT + "/openai/deployments/" + AZURE_OPENAI_DEPLOYMENT_NAME + "/chat/completions?api-version=" + API_VERSION;

  const payload = {
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messagesHistory
    ],
    temperature: 0.7,
    max_tokens: 800,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMsg = "Unknown error";
      try {
        const errorData = await response.json();
        errorMsg = JSON.stringify(errorData);
      } catch (e) {
        errorMsg = response.statusText;
      }
      return { error: true, text: "Azure API Error: " + errorMsg };
    }

    const data = await response.json();
    return { error: false, text: data.choices[0].message.content };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { error: true, text: "Sorry, a network error occurred." };
  }
}
