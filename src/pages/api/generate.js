import { GoogleAuth } from "google-auth-library";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  try {
    // Get the access token
    const auth = new GoogleAuth({
      keyFile: "./aikey.json",
      scopes: ["https://www.googleapis.com/auth/generative-language"],
    });
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();

    // Corrected model endpoint and payload structure
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.0:generateText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "models/gemini-2.0",
        prompt: {
          text: prompt,
        },
        temperature: 0.7,
        candidateCount: 1,
        topP: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from Gemini API:", errorData);
      return res.status(response.status).json({ error: errorData.error.message });
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.output || "No response from the model.";
    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
