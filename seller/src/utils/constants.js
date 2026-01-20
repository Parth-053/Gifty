export const APP_NAME = "Gifty";
export const API_BASE_URL = "http://localhost:8000/api/v1";
 
export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Decor",
  "Books",
  "Personalized Gifts"
];

export const ORDER_STATUS = {
  PENDING: { label: "Pending", color: "bg-orange-50 text-orange-600", border: "border-orange-100" },
  SHIPPED: { label: "Shipped", color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
  DELIVERED: { label: "Delivered", color: "bg-green-50 text-green-600", border: "border-green-100" },
  CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-600", border: "border-red-100" }
};