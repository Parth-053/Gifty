import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as addressService from "../../services/address.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Add New Address
 * @route   POST /api/v1/user/address
 */
export const createAddress = asyncHandler(async (req, res) => {
  // Pass 'User' as the ownerModel to differentiate from Seller addresses
  const address = await addressService.addAddress(req.user._id, "User", req.body);
  
  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, address, "Address added successfully"));
});

/**
 * @desc    Get My Addresses
 * @route   GET /api/v1/user/address
 */
export const getAddresses = asyncHandler(async (req, res) => {
  const list = await addressService.getAddressList(req.user._id);
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, list, "Addresses fetched successfully"));
});

/**
 * @desc    Update Address
 * @route   PUT /api/v1/user/address/:id
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressService.updateAddress(req.user._id, req.params.id, req.body);
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, address, "Address updated successfully"));
});

/**
 * @desc    Delete Address
 * @route   DELETE /api/v1/user/address/:id
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  await addressService.deleteAddress(req.user._id, req.params.id);
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Address deleted successfully"));
});