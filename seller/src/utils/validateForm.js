/**
 * Validates email format using regex
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates password strength
 * Requirement: Min 8 chars, at least 1 number
 * @param {string} password 
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  return password.length >= 8 && /\d/.test(password);
};

/**
 * Validates Indian Phone Number (10 digits)
 * @param {string} phone 
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

/**
 * Validates GSTIN (Indian GST Number)
 * Optional but recommended regex
 * @param {string} gstin 
 * @returns {boolean}
 */
export const validateGSTIN = (gstin) => {
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(gstin);
};