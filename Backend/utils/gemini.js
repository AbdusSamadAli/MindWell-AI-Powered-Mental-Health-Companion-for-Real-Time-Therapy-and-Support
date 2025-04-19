
require("dotenv").config();
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
/**
 * Sends a prompt to Google Gemini and returns the generated response.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const askGemini = async (prompt) => {
    try {
      const response = await axios.post(GEMINI_URL, {
        contents: [{ parts: [{ text: prompt }] }],
      });
  
      const result =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      return result;
    } catch (error) {
      console.error("🔴 Gemini API error full response:", error?.response?.data);
      console.error("🔴 Gemini API error status:", error?.response?.status);
      console.error("🔴 Gemini API error message:", error.message);
      throw new Error("Failed to fetch from Gemini");
    }
  };  

module.exports = askGemini;
