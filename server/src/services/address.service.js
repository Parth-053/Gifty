import {Address} from "../models/Address.model.js";
import {ApiError} from "../utils/apiError.js";

/**
 * Add New Address
 * - Automatically sets as default if it's the first one.
 * - If user marks as default, unsets previous default.
 */
export const addAddress = async (userId, ownerModel, addressData) => {
  // 1. Check if this is the user's first address
  const count = await Address.countDocuments({ user: userId });
  
  if (count === 0) {
    addressData.isDefault = true;
  }

  // 2. If new address is Default, unset all others first
  if (addressData.isDefault) {
    await Address.updateMany(
      { user: userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  // 3. Create the address
  const address = await Address.create({
    ...addressData,
    user: userId,
  });

  return address;
};

/**
 * Get Address List
 * - Sorts by Default first, then by latest updated
 */
export const getAddressList = async (userId) => {
  return await Address.find({ user: userId })
    .sort({ isDefault: -1, updatedAt: -1 });
};

/**
 * Update Address
 * - Handles switching default status
 */
export const updateAddress = async (userId, addressId, updateData) => {
  // If setting to default, unset others first
  if (updateData.isDefault === true) {
    await Address.updateMany(
      { user: userId, _id: { $ne: addressId } }, // $ne means "not equal"
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return address;
};

/**
 * Set Specific Address as Default
 */
export const setDefaultAddress = async (userId, addressId) => {
  // 1. Unset all addresses for this user
  await Address.updateMany(
    { user: userId },
    { $set: { isDefault: false } }
  );

  // 2. Set the requested one as true
  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    { $set: { isDefault: true } },
    { new: true }
  );

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return address;
};

/**
 * Delete Address
 * - If default is deleted, assigns default to the most recently updated address
 */
export const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, user: userId });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Smart Fail-over: If we deleted the default address, promote another one
  if (address.isDefault) {
    const latestAddress = await Address.findOne({ user: userId }).sort({ updatedAt: -1 });
    if (latestAddress) {
      latestAddress.isDefault = true;
      await latestAddress.save();
    }
  }

  return address;
};