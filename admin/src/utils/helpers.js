import moment from "moment";

/**
 * Get Tailwind color classes for various statuses
 */
export const getStatusColor = (status) => {
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    // Success / Active
    case "active":
    case "delivered":
    case "approved":
    case "paid":
    case "completed":
      return "bg-green-100 text-green-800";

    // Warning / Pending
    case "pending":
    case "processing":
    case "shipped":
    case "requested":
      return "bg-yellow-100 text-yellow-800";

    // Error / Rejected
    case "blocked":
    case "cancelled":
    case "rejected":
    case "failed":
    case "returned":
      return "bg-red-100 text-red-800";

    // Neutral / Default
    case "draft":
    case "inactive":
      return "bg-gray-100 text-gray-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Truncate long text (for descriptions in tables)
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

/**
 * Generate initials from name (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};