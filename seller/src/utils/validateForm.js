export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // Min 8 chars, at least 1 letter and 1 number
  // const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
  // keeping it simple for now:
  return password && password.length >= 6;
};

/**
 * Validates Product Form Data
 */
export const validateProductForm = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Product name must be at least 3 characters";
  }

  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
    errors.price = "Please enter a valid price";
  }

  if (!data.stock || isNaN(data.stock) || Number(data.stock) < 0) {
    errors.stock = "Please enter valid stock quantity";
  }

  if (!data.category) {
    errors.category = "Please select a category";
  }

  if (!data.images || data.images.length === 0) {
    errors.images = "At least one product image is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates Login Form
 */
export const validateLoginForm = (data) => {
  const errors = {};
  if (!validateEmail(data.email)) errors.email = "Invalid email address";
  if (!data.password) errors.password = "Password is required";
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};