export const formatPrice = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "₹0";
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // Removes decimal .00 for cleaner look
  }).format(amount);
};

export const calculateDiscount = (originalPrice, sellingPrice) => {
  if (!originalPrice || !sellingPrice || originalPrice <= sellingPrice) return 0;
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
};