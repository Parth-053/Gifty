import { SearchTerm } from "../models/SearchTerm.model.js";
import { Product } from "../models/Product.model.js";

/**
 * Tracks a search term (increments count or creates new)
 */
export const trackSearchTerm = async (query) => {
  if (!query || query.trim().length === 0) return;
  
  const term = query.trim().toLowerCase();
  
  await SearchTerm.findOneAndUpdate(
    { term },
    { 
      $inc: { count: 1 }, 
      lastSearchedAt: new Date() 
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

/**
 * Fetches top 10 trending search terms
 */
export const getTrendingTerms = async (limit = 10) => {
  const trending = await SearchTerm.find({})
    .sort({ count: -1, lastSearchedAt: -1 })
    .limit(limit)
    .select("term");
    
  return trending.map(t => t.term);
};

/**
 * Gets Autocomplete Suggestions (History + Products)
 */
export const getSuggestions = async (query, limit = 8) => {
  const regex = new RegExp(`^${query}`, 'i'); // Starts with query

  // 1. Find matching History Terms
  const historyTerms = await SearchTerm.find({ term: regex })
    .sort({ count: -1 })
    .limit(5)
    .select("term");

  // 2. Find matching Products
  const products = await Product.find({ 
      name: regex,
      isActive: true,
      isDeleted: false
    })
    .limit(5)
    .select("name");

  // 3. Combine and Format
  const suggestions = [
    ...historyTerms.map(t => ({ type: 'history', text: t.term })),
    ...products.map(p => ({ type: 'product', text: p.name }))
  ];

  // Remove duplicates
  const uniqueSuggestions = Array.from(new Set(suggestions.map(s => s.text)))
    .map(text => suggestions.find(s => s.text === text));

  return uniqueSuggestions.slice(0, limit);
};

/**
 * Performs the actual product search
 */
export const searchProducts = async (query, page = 1, limit = 20) => {
  const searchRegex = new RegExp(query, 'i');
  
  const filter = {
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { brand: searchRegex },
      { 'category.name': searchRegex } 
    ],
    isActive: true,
    isDeleted: false
  };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .select("name price images discount description rating")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  return { products, total };
};