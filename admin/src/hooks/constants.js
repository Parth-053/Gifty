export const APP_NAME = "AdminPanel";
export const ITEMS_PER_PAGE = 10;

// Roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  SUPPORT: 'support',
  EDITOR: 'editor'
};

// Status Colors for Badges (Used in Tables)
export const STATUS_COLORS = {
  Active: 'bg-green-50 text-green-600 border-green-100',
  Inactive: 'bg-gray-50 text-gray-600 border-gray-100',
  Pending: 'bg-orange-50 text-orange-600 border-orange-100',
  Verified: 'bg-blue-50 text-blue-600 border-blue-100',
  Rejected: 'bg-red-50 text-red-600 border-red-100',
  Blocked: 'bg-red-50 text-red-600 border-red-100',
  Delivered: 'bg-green-50 text-green-600 border-green-100',
  Processing: 'bg-blue-50 text-blue-600 border-blue-100',
};

// File Upload Limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];