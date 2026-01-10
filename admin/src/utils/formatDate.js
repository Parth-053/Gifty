/**
 * Formats a date string to "12 Jan, 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

/**
 * Formats a date string to "12 Jan, 2024 at 10:30 AM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};