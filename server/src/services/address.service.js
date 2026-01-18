import Address from "../models/Address.model.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Add New Address
 * Automatically sets as default if it's the first address.
 */
export const addAddress = async (userId, addressData) => {
  // Check if this is the first address
  const addressCount = await Address.countDocuments({ userId });
  
  if (addressCount === 0) {
    addressData.isDefault = true;
  }

  // If new address is marked as default, unset previous default
  if (addressData.isDefault) {
    await Address.updateMany(
      { userId, isDefault: true },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    ...addressData,
    userId
  });

  return address;
};

/**
 * Get All Addresses
 * Returns default address first.
 */
export const getAddressList = async (userId) => {
  return await Address.find({ userId })
    .sort({ isDefault: -1, createdAt: -1 }); // Default first, then new ones
};

/**
 * Update Address
 * Handles default toggle logic.
 */
export const updateAddress = async (userId, addressId, updateData) => {
  const address = await Address.findOne({ _id: addressId, userId });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // If setting as default, unset others
  if (updateData.isDefault === true) {
    await Address.updateMany(
      { userId, _id: { $ne: addressId } }, // All except current
      { isDefault: false }
    );
  }

  Object.assign(address, updateData);
  await address.save();
  return address;
};

/**
 * Delete Address
 */
export const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, userId });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }
  return true;
};