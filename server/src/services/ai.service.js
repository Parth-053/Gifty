import { aiModel } from "../config/gemini.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Generate Gift Suggestions
 */
export const generateGiftIdeas = async (data) => {
  if (!aiModel) {
    console.warn("Gemini AI not configured.");
    return fallbackSuggestions(); // Return static list if no key
  }

  try {
    const prompt = `
      Act as a professional gift consultant. 
      Suggest 5 unique gift categories for a ${data.relation} (Age: ${data.age}) for the occasion of ${data.occasion}.
      Interests: ${data.interests}.
      Budget: Under ₹${data.budget}.
      
      Strictly return ONLY a valid JSON array of strings. Example: ["Smart Watch", "Leather Wallet"].
      Do NOT add any markdown, backticks, or explanations.
    `;

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up response (Remove ```json ... ``` wrappers)
    const cleanedText = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("AI Service Error:", error);
    return fallbackSuggestions();
  }
};

/**
 * Generate Message (Gift Card)
 */
export const generateGiftMessage = async (recipientName, occasion, tone = "heartfelt") => {
  if (!aiModel) return `Happy ${occasion}, ${recipientName}!`;

  try {
    const prompt = `Write a short, ${tone} message (max 30 words) for ${recipientName} on the occasion of ${occasion}. No quotes.`;
    
    const result = await aiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return `Wishing you a wonderful ${occasion}!`;
  }
};

// Fallback data prevents frontend crashes
const fallbackSuggestions = () => [
  "Personalized Photo Frame", "Gift Hamper", "Smart Accessories", "Home Decor", "Premium Chocolates"
];