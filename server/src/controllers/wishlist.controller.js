import Wishlist from "../models/Wishlist.model.js";

/* GET wishlist */
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id })
      .populate("productId");

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ADD to wishlist */
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      userId: req.user.id,
      productId,
    });

    if (exists)
      return res.status(400).json({ message: "Already in wishlist" });

    const item = await Wishlist.create({
      userId: req.user.id,
      productId,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* REMOVE from wishlist */
export const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
