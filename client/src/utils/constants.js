export const APP_NAME = "Gifty";
export const SUPPORT_EMAIL = "support@gifty.com";
export const SUPPORT_PHONE = "+91 98765 43210";

export const ITEMS_PER_PAGE = 12;

export const ORDER_STATUS = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  RETURNED: { label: "Returned", color: "bg-orange-100 text-orange-700" },
};

export const PAYMENT_METHODS = {
  COD: "Cash on Delivery",
  ONLINE: "Online Payment (UPI/Card)",
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Average Rating" },
];