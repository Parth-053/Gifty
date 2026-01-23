import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as aiService from "../../services/ai.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get AI-Powered Gift Suggestions
 * @route   POST /api/v1/shop/ai/suggestions
 */
export const getGiftSuggestions = asyncHandler(async (req, res) => {
  const { relation, occasion, interests, budget, age } = req.body;

  // Call the AI Service
  const suggestions = await aiService.generateGiftIdeas({
    relation,
    occasion,
    interests,
    budget,
    age
  });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, suggestions, "AI suggestions generated successfully"));
});

/**
 * @desc    Generate Gift Card Message
 * @route   POST /api/v1/shop/ai/message
 */
export const getGiftMessage = asyncHandler(async (req, res) => {
  const { recipientName, occasion, tone } = req.body;

  const message = await aiService.generateGiftMessage(recipientName, occasion, tone);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { message }, "Message generated successfully"));
});