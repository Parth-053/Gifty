import { GoogleGenerativeAI } from "@google/generative-ai";
import { envConfig } from "./env.config.js";

// Initialize Gemini only if key exists
let aiModel = null;

if (envConfig.ai.geminiKey) {
  const genAI = new GoogleGenerativeAI(envConfig.ai.geminiKey);
  // Using 'gemini-pro' for text-based tasks (descriptions, chat)
  aiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
}

export { aiModel };