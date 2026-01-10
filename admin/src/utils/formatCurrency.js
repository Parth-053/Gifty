/**
 * Formats a number to Indian Rupee (₹) format
 * Example: 12500 -> ₹12,500
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats compact numbers for charts (e.g. 1.2M, 5K)
 */
export const formatCompactNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(number);
};