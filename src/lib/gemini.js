// lib/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEN_API_KEY = "AIzaSyA2zAakoA-OrLgLmPrKB8q_CTJRrekNpAY"; // Replace with your key

const genAI = new GoogleGenerativeAI(GEN_API_KEY);

export async function generateEmail(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}