import generateEmail from "@/lib/gemini"; // Updated import path

export default async function handler(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const emailContent = await generateEmail(prompt);

    if (!emailContent) {
      return res.status(500).json({ error: "Failed to generate email" });
    }

    res.status(200).json({ email: emailContent });
  } catch (error) {
    console.error("Gemini API error in handler:", error);
    res.status(500).json({ error: "Failed to generate email" });
  }
}