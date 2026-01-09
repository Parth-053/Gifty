import { Router } from "express";
import { getGiftSuggestions, generateGiftMessage } from "../services/ai.service.js"; // Importing service directly as controller logic is minimal
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔓 Public: AI Suggestions
router.post("/suggest", asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) throw new ApiError(httpStatus.BAD_REQUEST, "Prompt required");
  
  const suggestions = await getGiftSuggestions(prompt);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, suggestions, "AI Suggestions fetched"));
}));

// 🔒 Protected: Gift Message Generation
router.post("/generate-message", verifyJWT, asyncHandler(async (req, res) => {
  const { recipientName, relationship, occasion, tone } = req.body;
  const message = await generateGiftMessage({ recipientName, relationship, occasion, tone });
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { message }, "Message generated"));
}));

export default router;