// import { GoogleGenerativeAI } from "@google/generative-ai"; // Install this package if using Gemini
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { Product } from "../../models/Product.model.js";

// Initialize AI Client (Configure in env)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGiftSuggestions = asyncHandler(async (req, res) => {
  const { relation, occasion, interests, budget } = req.body;

  // 1. Construct Prompt
  const prompt = `Suggest gift ideas for a ${relation} for ${occasion}. 
  Interests: ${interests}. Budget: under ₹${budget}. 
  Return only JSON array of keywords (e.g. ["watch", "perfume"]).`;

  // 2. Call AI API (Mocked for now)
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // const result = await model.generateContent(prompt);
  // const keywords = JSON.parse(result.response.text());

  // Mock keywords
  const keywords = ["watch", "mug", "tshirt", "perfume"]; 

  // 3. Search Database for these keywords
  const suggestions = await Product.find({
    $text: { $search: keywords.join(" ") },
    price: { $lte: Number(budget) },
    isActive: true
  }).limit(5);

  return res.status(200).json(new ApiResponse(200, suggestions, "AI Suggestions fetched"));
});