// src/pages/api/generate.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailableModels() {
  const models = await genAI.getAvailableModels();
  console.log("Available Models:", models);
  return models;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const availableModels = await listAvailableModels();
      return res.status(200).json({ models: availableModels });
    } catch (error) {
      console.error("Error listing models:", error);
      return res.status(500).json({ error: "Failed to list models" });
    }
  }

  if (req.method === "POST") {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(`Write a professional, heartfelt email: ${prompt}`);

      const response = await result.response;
      const email = response.text();

      res.status(200).json({ email });
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}