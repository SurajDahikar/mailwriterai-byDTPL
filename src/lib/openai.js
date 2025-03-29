// src/lib/openai.js

import OpenAI from "openai";

const generateEmail = async (prompt) => {
    let retries = 3;
    let delay = 1000; // Initial delay in milliseconds

    while (retries > 0) {
        try {
            const response = await fetch("https://api.openai.com/v1/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // Use NEXT_PUBLIC_OPENAI_API_KEY
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    prompt: prompt,
                    max_tokens: 500,
                    temperature: 0.7,
                }),
            });

            console.log("OpenAI API Response:", response);

            if (response.ok) {
                const data = await response.json();
                console.log("OpenAI API Response Data:", data);

                if (data.choices && data.choices.length > 0) {
                    return data.choices[0].text.trim();
                } else {
                    throw new Error("No response from OpenAI API");
                }
            } else if (response.status === 429) {
                // Rate limit exceeded, retry after delay
                retries--;
                if (retries > 0) {
                    console.warn(`Rate limit exceeded. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                } else {
                    const errorText = await response.text();
                    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
                }
            } else {
                const errorText = await response.text();
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
            }
        } catch (error) {
            console.error("Error generating email:", error);
            return "Sorry, an error occurred while generating the email. Please try again later.";
        }
    }
    return "Sorry, an error occurred while generating the email. Please try again later."; // Return a default error message if all retries fail.
};

export { generateEmail };