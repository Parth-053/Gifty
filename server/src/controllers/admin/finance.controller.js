import { Transaction } from "../../models/Transaction.model.js";
import { Payout } from "../../models/Payout.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Transactions
 * @route   GET /api/v1/admin/finance/transactions
 */
export const getAllTransactions = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Transaction.find().populate("orderId", "orderId totalAmount"), req.query)
    .filter()
    .sort()
    .paginate();

  const transactions = await features.query;
  const total = await Transaction.countDocuments();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { transactions, total }, "Transactions fetched"));
});

/**
 * @desc    Get All Payouts
 * @route   GET /api/v1/admin/finance/payouts
 */
export const getAllPayouts = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Payout.find().populate("sellerId", "storeName fullName"), req.query)
    .filter()
    .sort()
    .paginate();

  const payouts = await features.query;
  const total = await Payout.countDocuments();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { payouts, total }, "Payouts fetched"));
});