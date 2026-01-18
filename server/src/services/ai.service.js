import { GoogleGenerativeAI } from "@google/generative-ai";
import { envConfig } from "../config/env.config.js";
import { ApiError } from "../utils/apiError.js";

// Initialize API Client
// Ensure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "your_api_key_here");

/**
 *  Generate Gift Suggestions
 * @param {Object} data - { relation, occasion, interests, budget, age }
 */
export const generateGiftIdeas = async (data) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Act as a professional gift consultant. 
      Suggest 5 unique gift categories for a ${data.relation} (Age: ${data.age}) for the occasion of ${data.occasion}.
      Interests: ${data.interests}.
      Budget: Under ₹${data.budget}.
      
      Strictly return ONLY a valid JSON array of strings (e.g. ["Smart Watch", "Leather Wallet"]). 
      Do not add any markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up response if AI adds markdown
    const cleanedText = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Service Error:", error);
    // Fallback: Return basic keywords if AI fails to prevent app crash
    return ["Watch", "Perfume", "Photo Frame", "Chocolates", "Apparel"];
  }
};

/**
 *  Generate Personalized Message (For Gift Card)
 */
export const generateGiftMessage = async (recipientName, occasion, tone = "heartfelt") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Write a short, ${tone} message for ${recipientName} on ${occasion}. Max 30 words.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return `Happy ${occasion}, ${recipientName}! Best wishes.`;
  }
};