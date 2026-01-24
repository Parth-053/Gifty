import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'MMM d, yyyy') : "Invalid Date";
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : "Invalid Date";
};

// 🆕 Used in Dashboard
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : "";
  } catch  {
    return "";
  }
};