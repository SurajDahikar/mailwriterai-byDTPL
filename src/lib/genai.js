const generateEmail = async (prompt) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        let errorMessage = "Email generation failed.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      if (!data || !data.text) {
        throw new Error("No email text received from the API.");
      }
  
      console.log("Generated Email:", data.text); // Log the generated email for debugging
      return data.text;
    } catch (error) {
      console.error("Error generating email with Gemini API:", error.message);
      throw new Error(error.message || "Failed to generate email. Please try again later.");
    }
  };
  
  export { generateEmail };
  