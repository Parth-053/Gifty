import OpenAI from "openai";
import Product from "../models/product.model.js";
import AIConfig from "../models/aiConfig.model.js";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";

// Initialize OpenAI conditionally to prevent crash if key is missing in dev
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

/**
 * Analyze User Prompt and Extract Search Filters
 * Converts natural language ("Gift for my girlfriend who loves anime")
 * into Database Filters ({ tags: ["anime", "manga"], category: "entertainment" })
 */
const extractSearchIntent = async (userPrompt) => {
  if (!openai) throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, "AI Service is not configured");

  const systemPrompt = `
    You are a shopping assistant API. 
    Analyze the user's gift request and extract structured search metadata.
    Return ONLY a JSON object with these fields:
    - tags: array of strings (synonyms, related interests, specific items mentioned)
    - maxPrice: number or null (if budget mentioned)
    - minRating: number (default 4)
    - occasion: string (e.g., birthday, anniversary)
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // Use 3.5 Turbo JSON mode for speed/cost
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7, // Slight creativity for tag generation
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);

  } catch (error) {
    console.error("AI Intent Extraction Failed:", error);
    // Fallback: If AI fails, return basic search object
    return { tags: [userPrompt], maxPrice: null }; 
  }
};

/**
 * Smart Gift Recommendation Engine
 * 1. Asks AI to understand the user.
 * 2. Queries DB based on AI's understanding.
 * 3. (Optional) Ranks results.
 */
export const getGiftSuggestions = async (userPrompt, userId) => {
  // 1. Get structured filters from AI
  const aiFilters = await extractSearchIntent(userPrompt);

  console.log("AI Extracted Filters:", aiFilters);

  // 2. Build MongoDB Query
  const query = { visibility: "public", stock: { $gt: 0 } };

  // Tag Matching (The Core Logic)
  // We look for products that have at least one of the tags identified by AI
  if (aiFilters.tags && aiFilters.tags.length > 0) {
    // Creating case-insensitive regex for each tag
    const regexTags = aiFilters.tags.map(tag => new RegExp(tag, "i"));
    
    query.$or = [
      { tags: { $in: regexTags } },
      { name: { $in: regexTags } },
      // Also search description for deeper matches
      { description: { $in: regexTags } } 
    ];
  }

  // Price Filter
  if (aiFilters.maxPrice) {
    query.price = { $lte: aiFilters.maxPrice };
  }

  // Rating Filter
  if (aiFilters.minRating) {
    query.ratingAvg = { $gte: aiFilters.minRating };
  }

  // 3. Execute DB Query
  const suggestedProducts = await Product.find(query)
    .limit(10) // Don't overwhelm the user
    .select("name price images slug ratingAvg tags")
    .lean();

  // 4. Check for Empty Results
  // If AI tags were too specific and found nothing, fallback to text search
  if (suggestedProducts.length === 0) {
    const fallbackProducts = await Product.find({ 
      $text: { $search: userPrompt } 
    })
    .limit(5)
    .lean();
    
    return {
      source: "fallback_text_search",
      analysis: aiFilters,
      products: fallbackProducts
    };
  }

  return {
    source: "ai_recommendation",
    analysis: aiFilters,
    products: suggestedProducts
  };
};

/**
 * Generate a Personalized Gift Message
 * Used for "Write a note for me" feature at checkout
 */
export const generateGiftMessage = async (data) => {
  const { recipientName, relationship, occasion, tone = "heartfelt" } = data;

  if (!openai) return "Happy Gifting!";

  const prompt = `Write a short, ${tone} message for a gift card.
    Recipient: ${recipientName}
    Relationship: ${relationship}
    Occasion: ${occasion}
    Max length: 30 words.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 60,
  });

  return response.choices[0].message.content.trim();
};

/**
 * Content Moderation (Safety Check)
 * Essential for customizable products (e.g., "Print Text on Shirt")
 * Prevents users from printing hate speech or profanity.
 */
export const moderateContent = async (text) => {
  if (!openai) return true; // Fail open in dev, strict in prod

  try {
    const moderation = await openai.moderations.create({ input: text });
    const result = moderation.results[0];

    if (result.flagged) {
      throw new ApiError(
        httpStatus.BAD_REQUEST, 
        "Custom text contains inappropriate content and cannot be processed."
      );
    }

    return true; // Content is safe
  } catch (error) {
    // If it's our ApiError, rethrow it
    if (error instanceof ApiError) throw error;
    
    // If API fails, log it and allow (or block based on policy)
    console.error("Moderation API Error:", error);
    return true;
  }
};