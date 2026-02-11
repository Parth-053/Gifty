import { User } from "../models/User.model.js";
import { Seller } from "../models/Seller.model.js";
import { Address } from "../models/Address.model.js";
import { ApiError } from "../utils/ApiError.js";

export const syncUser = async (userData) => {
  const { firebaseUid, email, fullName, avatar, phone, addressData } = userData;

  let user = await User.findOne({ firebaseUid });
  let isNewUser = false;

  if (!user) {
    // Create New User (Force isEmailVerified to true since OTP is handled first)
    user = await User.create({
      firebaseUid,
      email,
      fullName,
      avatar,
      phone,
      role: "user",
      isEmailVerified: true 
    });
    isNewUser = true;

    // Save Address if user provided it during registration
    if (addressData) {
      const newAddress = await Address.create({
        ...addressData,
        user: user._id,
        fullName: fullName,
        phone: phone || "0000000000"
      });
      user.addresses.push(newAddress._id);
      await user.save();
    }
  } else {
    if (fullName) user.fullName = fullName;
    if (avatar?.url) user.avatar = avatar;
    if (phone) user.phone = phone;
    await user.save();
  }

  return { user, isNewUser };
};

export const syncSeller = async (sellerData) => {
  const { firebaseUid, email, fullName, storeName, phone, gstin } = sellerData;

  let seller = await Seller.findOne({ firebaseUid });
  let isNewSeller = false;

  if (!seller) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "Account exists as a Buyer. Contact support to upgrade.");
    }

    seller = await Seller.create({
      firebaseUid, email, fullName, storeName, phone, gstin,
      status: "pending", 
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

export const getProfile = async (uid, role) => {
  if (role === "seller") {
    const seller = await Seller.findOne({ firebaseUid: uid });
    if (!seller) throw new ApiError(404, "Seller profile not found");
    return seller;
  } else {
    // Use .populate("addresses") so the UI gets the actual address data, not just IDs
    const user = await User.findOne({ firebaseUid: uid }).populate("addresses");
    if (!user) throw new ApiError(404, "User profile not found");
    return user;
  }
};