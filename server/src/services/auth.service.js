import { User } from "../models/User.model.js";
import { Seller } from "../models/Seller.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Sync User (Login/Register)
 */
export const syncUser = async (userData) => {
  const { firebaseUid, email, fullName, avatar, phone } = userData;

  let user = await User.findOne({ firebaseUid });
  let isNewUser = false;

  if (!user) {
    // Create New
    user = await User.create({
      firebaseUid,
      email,
      fullName,
      avatar,
      phone,
      role: "user",
      isEmailVerified: userData.isEmailVerified
    });
    isNewUser = true;
  } else {
    // Update Existing
    if (fullName) user.fullName = fullName;
    if (avatar?.url) user.avatar = avatar;
    if (phone) user.phone = phone;
    await user.save();
  }

  return { user, isNewUser };
};

/**
 * Sync Seller (Application)
 */
export const syncSeller = async (sellerData) => {
  const { firebaseUid, email, fullName, storeName, phone, gstin } = sellerData;

  let seller = await Seller.findOne({ firebaseUid });
  let isNewSeller = false;

  if (!seller) {
    // Check if email already used by a regular User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "Account exists as a Buyer. Contact support to upgrade.");
    }

    seller = await Seller.create({
      firebaseUid,
      email,
      fullName,
      storeName,
      phone,
      gstin,
      status: "pending", // Requires Admin Approval
      businessAddress: { street: "", city: "", state: "", zipCode: "", country: "India" },
      bankDetails: { accountNumber: "", ifscCode: "", bankName: "", accountName: "" }
    });
    isNewSeller = true;
  } else {
    if (fullName) seller.fullName = fullName;
    if (storeName) seller.storeName = storeName;
    await seller.save();
  }

  return { seller, isNewSeller };
};

/**
 * Get Profile by Role
 */
export const getProfile = async (uid, role) => {
  if (role === "seller") {
    const seller = await Seller.findOne({ firebaseUid: uid });
    if (!seller) throw new ApiError(404, "Seller profile not found");
    return seller;
  } else {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) throw new ApiError(404, "User profile not found");
    return user;
  }
};