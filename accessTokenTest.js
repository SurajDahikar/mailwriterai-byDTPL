const { GoogleAuth } = require("google-auth-library");

async function getAccessToken() {
  try {
    const auth = new GoogleAuth({
      keyFile: "./aikey.json",
      scopes: ["https://www.googleapis.com/auth/generative-language"],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log("Access Token:", token);
  } catch (error) {
    console.error("Error generating access token:", error.message);
  }
}

getAccessToken();
