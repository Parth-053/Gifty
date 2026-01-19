/**
 * Formats a number to Indian Rupee (₹) format
 * Example: 12500 -> ₹12,500.00
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
 * Formats compact numbers for charts (e.g. 12000 -> 12K, 1500000 -> 1.5M)
 */
export const formatCompactNumber = (number) => {
  if (!number) return '0';
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(number);
};