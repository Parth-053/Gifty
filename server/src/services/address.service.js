import { Address } from "../models/Address.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Add New Address
 * @param {String} ownerId - ID of User or Seller
 * @param {String} ownerModel - "User" or "Seller"
 * @param {Object} addressData
 */
export const addAddress = async (ownerId, ownerModel, addressData) => {
  // Check if this is the first address for this owner
  const addressCount = await Address.countDocuments({ ownerId });
  
  // If first address, force default
  if (addressCount === 0) {
    addressData.isDefault = true;
  }

  // If new address is marked default, unset previous default
  if (addressData.isDefault) {
    await Address.updateMany(
      { ownerId, isDefault: true },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    ...addressData,
    ownerId,
    ownerModel // Dynamic reference
  });

  return address;
};

/**
 * Get All Addresses for Owner
 */
export const getAddressList = async (ownerId) => {
  return await Address.find({ ownerId })
    .sort({ isDefault: -1, createdAt: -1 }); // Default first
};

/**
 * Update Address
 */
export const updateAddress = async (ownerId, addressId, updateData) => {
  const address = await Address.findOne({ _id: addressId, ownerId });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // If setting as default, unset others
  if (updateData.isDefault === true) {
    await Address.updateMany(
      { ownerId, _id: { $ne: addressId } },
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
export const deleteAddress = async (ownerId, addressId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, ownerId });
  if (!address) throw new ApiError(404, "Address not found");
  return true;
};