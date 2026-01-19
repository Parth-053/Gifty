import { Transaction } from "../../models/Transaction.model.js";
import { Payout } from "../../models/Payout.model.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

// 1. Get All Transactions
export const getAllTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const transactions = await Transaction.find()
    .populate("orderId", "orderId totalAmount") // Populate Order info
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Transaction.countDocuments();

  return res.status(200).json(
    new ApiResponse(200, { transactions, total, currentPage: page }, "Transactions fetched")
  );
});

// 2. Get All Payouts 
export const getAllPayouts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const payouts = await Payout.find()
    .populate("sellerId", "storeName ownerName") // Populate Seller info
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Payout.countDocuments();

  return res.status(200).json(
    new ApiResponse(200, { payouts, total, currentPage: page }, "Payouts fetched")
  );
});