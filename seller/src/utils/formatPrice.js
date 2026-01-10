/**
 * Formats a number to Indian Rupee (₹) format
 * Example: 12500 -> ₹12,500
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculates Discount Percentage
 */
export const calculateDiscount = (originalPrice, sellingPrice) => {
  if (!originalPrice || !sellingPrice || originalPrice <= sellingPrice) return 0;
  const discount = ((originalPrice - sellingPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Formats large numbers (e.g., 1.5K, 1M) for dashboards
 */
export const formatCompactNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(number);
};