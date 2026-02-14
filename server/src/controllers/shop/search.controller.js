import * as searchService from "../../services/search.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { httpStatus } from "../../constants/httpStatus.js";

// Get Trending Searches
export const getTrending = asyncHandler(async (req, res) => {
  const terms = await searchService.getTrendingTerms();
  
  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, terms, "Trending searches fetched successfully")
  );
});

// Get Autocomplete Suggestions
export const getSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, [], "No query"));
  }

  const suggestions = await searchService.getSuggestions(q);

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, suggestions, "Suggestions fetched")
  );
});

// Perform Full Search
export const performSearch = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  // Track the search term only if a query exists
  if (q) {
    await searchService.trackSearchTerm(q); 
  }

  const { products, total } = await searchService.searchProducts(q, parseInt(page), parseInt(limit));

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, { products, total, page: parseInt(page) }, "Search results fetched")
  );
});