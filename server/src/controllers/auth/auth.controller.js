// server/src/controllers/auth/auth.controller.js
import { User } from "../../models/User.model.js";
import { Seller } from "../../models/Seller.model.js";
import{ asyncHandler} from "../../utils/asyncHandler.js";
import {ApiResponse }from "../../utils/apiResponse.js";
import {ApiError} from "../../utils/apiError.js";

// @desc    Sync User (Create if new, Return if exists)
// @route   POST /api/v1/auth/sync
export const syncUser = asyncHandler(async (req, res) => {
    const { uid, email, emailVerified } = req;
    const { fullName, phone, avatar } = req.body;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
        // Create New User
        user = await User.create({
            firebaseUid: uid,
            email,
            fullName: fullName || 'New User',
            phone,
            avatar,
            isEmailVerified: emailVerified
        });
    } else {
        // Optional: Update verification status if changed
        if (user.isEmailVerified !== emailVerified) {
            user.isEmailVerified = emailVerified;
            await user.save();
        }
    }

    return res.status(200).json(
        new ApiResponse(200, { user, role: 'user' }, "User synced successfully")
    );
});

// @desc    Sync Seller
// @route   POST /api/v1/auth/sync-seller
export const syncSeller = asyncHandler(async (req, res) => {
    const { uid, email, emailVerified } = req;
    const { fullName, storeName, phone, gstin } = req.body;

    let seller = await Seller.findOne({ firebaseUid: uid });

    if (!seller) {
        if (!storeName || !phone) {
            throw new ApiError(400, "Store Name and Phone are required for Seller Registration");
        }

        seller = await Seller.create({
            firebaseUid: uid,
            email,
            fullName,
            storeName,
            phone,
            gstin,
            isEmailVerified: emailVerified,
            status: 'pending'
        });
    }

    return res.status(200).json(
        new ApiResponse(200, { seller, role: 'seller' }, "Seller synced successfully")
    );
});

// @desc    Get Current Profile
// @route   GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200, { user: req.user, role: req.role }, "Profile fetched")
    );
});