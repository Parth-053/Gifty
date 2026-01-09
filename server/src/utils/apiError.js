class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 404, 500)
   * @param {string} message - Error message
   * @param {Array} errors - Array of validation errors or details
   * @param {string} stack - Error stack trace (optional)
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // Parent constructor (Error class) 
    super(message);

    this.statusCode = statusCode;
    
    // Data field ko null rakhte hain taaki ApiResponse ke structure se match kare
    this.data = null; 
    
    this.message = message;
    
    // Errors mein humesha success false hoga
    this.success = false;
    
    // Multiple errors (jaise validation fails) ke liye array
    this.errors = errors;

    // Stack Trace handling
    // Production mein hum stack trace avoid karte hain, lekin development mein ye zaroori hai
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;