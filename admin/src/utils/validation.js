export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Min 6 chars
  return password && password.length >= 6;
};

export const validatePhone = (phone) => {
  // Basic 10 digit check
  const re = /^\d{10}$/;
  return re.test(phone);
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};