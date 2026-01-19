export const APP_NAME = "Gifty Admin";
export const ITEMS_PER_PAGE = 10;

// Status Colors for Badges (Consistent across app)
export const STATUS_COLORS = {
  // General Status
  active: 'bg-green-50 text-green-700 border-green-100',
  inactive: 'bg-gray-50 text-gray-600 border-gray-100',
  
  // Verification / Approval
  pending: 'bg-orange-50 text-orange-700 border-orange-100',
  verified: 'bg-blue-50 text-blue-700 border-blue-100',
  rejected: 'bg-red-50 text-red-700 border-red-100',
  
  // Orders
  processing: 'bg-blue-50 text-blue-700 border-blue-100',
  shipped: 'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-green-50 text-green-700 border-green-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
  
  // Payments
  success: 'bg-green-50 text-green-700 border-green-100',
  failed: 'bg-red-50 text-red-700 border-red-100',
};

// File Upload Limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];