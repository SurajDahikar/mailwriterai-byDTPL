// src/pages/api/generate.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Store your API key in .env.local
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write a professional, heartfelt email: ${prompt}`,
      max_tokens: 100,
      temperature: 0.7,
    });

    const email = response.data.choices[0].text.trim();
    res.status(200).json({ email });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
