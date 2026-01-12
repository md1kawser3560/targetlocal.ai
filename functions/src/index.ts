import * as functions from "firebase-functions";
import * as cors from "cors";

const corsHandler = cors({ origin: true });

export const geminiProxy = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { prompt } = request.body;

      if (!prompt) {
        response.status(400).json({ error: "Prompt required" });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        response.status(500).json({ error: "API key not configured" });
        return;
      }

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      const data = await geminiResponse.json();
      response.json(data);
    } catch (error) {
      console.error("Error:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  });
});