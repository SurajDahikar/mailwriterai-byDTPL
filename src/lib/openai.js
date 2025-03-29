// src/lib/openai.js

const generateEmail = async (prompt) => {
    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 500,      // Increased max tokens for longer responses
          temperature: 0.7,     // Adjusted temperature for balanced responses
        }),
      });
  
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].text.trim();
      } else {
        throw new Error("No response from OpenAI API");
      }
    } catch (error) {
      console.error("Error generating email:", error.message);
      return "Sorry, an error occurred while generating the email. Please try again later.";
    }
  };
  
  export { generateEmail };
  