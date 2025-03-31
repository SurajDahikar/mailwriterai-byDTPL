import { google } from "@google-cloud/genai";
import dotenv from "dotenv";

dotenv.config();

export default async function generateEmail(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not set");
        }

        const url = "https://genai.googleapis.com/v1beta2/models/text-bison-001:predict";
        const prompt = req.body.prompt;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                instances: [{ content: prompt }],
                parameters: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                },
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("Error response from API:", errorDetails);
            return res.status(response.status).json({ error: "Failed to generate email", details: errorDetails });
        }

        const data = await response.json();
        console.log("API response:", data);

        res.status(200).json({ email: data.predictions[0].content });
    } catch (error) {
        console.error("Internal server error:", error.message);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
}
