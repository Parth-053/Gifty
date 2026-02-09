import { Coupon } from "../../models/Coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Coupons
 * @route   GET /api/v1/admin/coupons
 */
export const getCoupons = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Coupon.find(), req.query)
    .sort()
    .paginate();

  const coupons = await features.query;
  const total = await Coupon.countDocuments();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { coupons, total }, "Coupons fetched"));
});

/**
 * @desc    Get Single Coupon
 * @route   GET /api/v1/admin/coupons/:id
 */
export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found");

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, coupon, "Coupon details fetched"));
});

/**
 * @desc    Create Coupon
 * @route   POST /api/v1/admin/coupons
 */
export const createCoupon = asyncHandler(async (req, res) => {
  const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Coupon code already exists");

  const payload = { ...req.body };
  if (payload.maxDiscountAmount === "") delete payload.maxDiscountAmount;

  const coupon = await Coupon.create({
    ...payload,
    code: req.body.code.toUpperCase()
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, coupon, "Coupon created successfully"));
});

/**
 * @desc    Update Coupon
 * @route   PUT /api/v1/admin/coupons/:id
 */
export const updateCoupon = asyncHandler(async (req, res) => {
  let coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found");

  // If code is being changed, check for duplicates
  if (req.body.code && req.body.code.toUpperCase() !== coupon.code) {
    const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Coupon code already exists");
  }

  const payload = { ...req.body };
  if (req.body.code) payload.code = req.body.code.toUpperCase();
  if (payload.maxDiscountAmount === "") payload.maxDiscountAmount = null;

  coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, { new: true });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, coupon, "Coupon updated successfully"));
});

/**
 * @desc    Delete Coupon
 * @route   DELETE /api/v1/admin/coupons/:id
 */
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found");

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Coupon deleted successfully"));
});