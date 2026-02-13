import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import * as addressService from "../../services/address.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Add New Address
 * @route   POST /api/v1/user/address
 */
export const addAddress = asyncHandler(async (req, res) => {
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
 * @desc    Set Address as Default
 * @route   PATCH /api/v1/user/address/:id/default
 */
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await addressService.setDefaultAddress(req.user._id, req.params.id);
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, address, "Default address updated"));
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