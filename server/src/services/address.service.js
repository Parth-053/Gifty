import {Address} from "../models/Address.model.js";
import {ApiError} from "../utils/apiError.js";

/**
 * Add New Address
 */
export const addAddress = async (ownerId, ownerModel, addressData) => {
  // 1. Check existing addresses for this owner
  const count = await Address.countDocuments({ ownerId });
  
  // 2. Force default if it's the first one
  if (count === 0) {
    addressData.isDefault = true;
  }

  // 3. If new address is Default, unset previous defaults
  if (addressData.isDefault) {
    await Address.updateMany(
      { ownerId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  // 4. Create with correct field names (ownerId)
  const address = await Address.create({
    ...addressData,
    ownerId: ownerId,     // Matches Schema
    ownerModel: ownerModel // Matches Schema
  });

  return address;
};

/**
 * Get Address List
 * Uses ownerId to find addresses
 */
export const getAddressList = async (ownerId) => {
  return await Address.find({ ownerId })
    .sort({ isDefault: -1, updatedAt: -1 });
};

/**
 * Update Address
 */
export const updateAddress = async (ownerId, addressId, updateData) => {
  // If setting to default, unset others first
  if (updateData.isDefault === true) {
    await Address.updateMany(
      { ownerId, _id: { $ne: addressId } },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.findOneAndUpdate(
    { _id: addressId, ownerId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return address;
};

/**
 * Set Default Address
 */
export const setDefaultAddress = async (ownerId, addressId) => {
  // 1. Unset all
  await Address.updateMany(
    { ownerId },
    { $set: { isDefault: false } }
  );

  // 2. Set specific one
  const address = await Address.findOneAndUpdate(
    { _id: addressId, ownerId },
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
 */
export const deleteAddress = async (ownerId, addressId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, ownerId });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // If deleted was default, make newest one default
  if (address.isDefault) {
    const latest = await Address.findOne({ ownerId }).sort({ updatedAt: -1 });
    if (latest) {
      latest.isDefault = true;
      await latest.save();
    }
  }

  return address;
};