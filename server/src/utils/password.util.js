import bcrypt from "bcrypt";

// Cost factor: 10 is standard for commercial apps (approx 100ms per hash)
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password securely
 * @param {string} plainPassword 
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (plainPassword) => {
  if (!plainPassword) {
    throw new Error("Password is required for hashing");
  }
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a stored hash
 * @param {string} plainPassword - Entered by user
 * @param {string} hashedPassword - Stored in DB
 * @returns {Promise<boolean>} - True if match, False otherwise
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  return await bcrypt.compare(plainPassword, hashedPassword);
};