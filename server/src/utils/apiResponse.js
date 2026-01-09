/**
 * @class ApiResponse
 * @description Standardized class for handling successful API responses.
 * Ensures consistent structure across all endpoints.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 200, 201)
   * @param {any} data - The payload to be returned (object, array, string, etc.)
   * @param {string} message - A short description of the result
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    
    // The actual payload
    this.data = data;
    
    // Message for the client (e.g., "User logged in successfully")
    this.message = message;
    
    // Automatically determine success based on status code
    // Standard practice: Codes < 400 are success, >= 400 are errors
    this.success = statusCode < 400;
  }
}

export default ApiResponse;