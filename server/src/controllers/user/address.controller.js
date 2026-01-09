import Address from "../../models/address.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";

/**
 * @desc    Add a new Address
 * @route   POST /api/v1/addresses
 */
export const addAddress = asyncHandler(async (req, res) => {
  const { name, phone, street, city, state, pincode, country, isDefault } = req.body;

  // Logic: If setting as default, unset previous default first
  if (isDefault) {
    await Address.updateMany({ userId: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({
    userId: req.user._id,
    name,
    phone,
    street,
    city,
    state,
    pincode,
    country: country || "India",
    isDefault: isDefault || false
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, address, "Address added successfully"));
});

/**
 * @desc    Get All User Addresses
 * @route   GET /api/v1/addresses
 */
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userId: req.user._id })
    .sort({ isDefault: -1, createdAt: -1 }); // Default first, then new ones

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, addresses, "Addresses fetched successfully"));
});

/**
 * @desc    Get Single Address
 * @route   GET /api/v1/addresses/:addressId
 */
export const getAddressById = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const address = await Address.findOne({ _id: addressId, userId: req.user._id });

  if (!address) throw new ApiError(httpStatus.NOT_FOUND, "Address not found");

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, address, "Address details fetched"));
});

/**
 * @desc    Update Address
 * @route   PATCH /api/v1/addresses/:addressId
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const updates = req.body;

  const addressExists = await Address.findOne({ _id: addressId, userId: req.user._id });
  if (!addressExists) throw new ApiError(httpStatus.NOT_FOUND, "Address not found");

  if (updates.isDefault === true) {
    await Address.updateMany({ userId: req.user._id }, { isDefault: false });
  }

  const updatedAddress = await Address.findByIdAndUpdate(addressId, updates, { new: true });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedAddress, "Address updated successfully"));
});

/**
 * @desc    Delete Address
 * @route   DELETE /api/v1/addresses/:addressId
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const address = await Address.findOneAndDelete({ _id: addressId, userId: req.user._id });

  if (!address) throw new ApiError(httpStatus.NOT_FOUND, "Address not found");

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Address deleted successfully"));
});