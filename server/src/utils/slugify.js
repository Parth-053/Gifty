/**
 * Converts a string into a URL-friendly slug
 * @param {String} text - e.g. "Apple iPhone 15 Pro Max"
 * @returns {String} - e.g. "apple-iphone-15-pro-max"
 */
export const slugify = (text) => {
  if (!text) return "";
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-");  // Replace multiple - with single -
};