import Product from "../models/Product.model.js";

/**
 * USER: GET ALL CATEGORIES (for sidebar)
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", {
      isApproved: true,
    });

    // Convert to UI-friendly format
    const formatted = categories.map((cat) => ({
      name: cat,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
