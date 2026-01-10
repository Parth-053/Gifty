export const APP_NAME = "Gifty Seller Hub";
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Pagination Defaults
export const ITEMS_PER_PAGE = 10;

// Order Status Config (Color Mapping)
export const ORDER_STATUS = {
  PENDING: { label: 'Pending', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
  PROCESSING: { label: 'Processing', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-50 text-green-600', border: 'border-green-100' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-50 text-red-600', border: 'border-red-100' },
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  "Customized Gifts",
  "Home Decor",
  "Fashion & Accessories",
  "Kitchenware",
  "Stationery",
  "Electronics",
  "Toys & Games"
];

// File Upload Limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];