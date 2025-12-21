import Product from "../models/Product.model.js";

/* =========================
   SELLER: ADD PRODUCT
   ========================= */
export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      images,
      category,
      customization,
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      images,
      category,
      sellerId: req.user.id,

      customization: customization
        ? {
            isCustomizable: customization.isCustomizable || false,
            mandatoryUploads: {
              images: customization?.mandatoryUploads?.images || false,
              text: customization?.mandatoryUploads?.text || false,
            },
            uploadLimits: {
              minImages: customization?.uploadLimits?.minImages || 0,
              maxImages: customization?.uploadLimits?.maxImages || 0,
            },
            allowRandomize: customization?.allowRandomize || false,
          }
        : { isCustomizable: false },

      isApproved: false,
    });

    res.status(201).json({
      message: "Product added, waiting for admin approval",
      productId: product._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   SELLER: MY PRODUCTS
   ========================= */
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: req.user.id,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   USER: GET ALL APPROVED PRODUCTS (SAFE + FILTERED)
   ========================= */
export const getApprovedProducts = async (req, res) => {
  try {
    const { category, sort, rating, customizable } = req.query;

    const query = { isApproved: true };

    // 🔹 CATEGORY FILTER (existing logic – unchanged)
    if (category && category !== "All") {
      query.category = category;
    }

    // 🔹 RATING FILTER (works for All & category)
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 🔹 CUSTOMIZABLE FILTER
    if (customizable === "true") {
      query["customization.isCustomizable"] = true;
    }

    // 🔹 SORTING
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "rating") sortOption.rating = -1;
    if (sort === "newest") sortOption.createdAt = -1;

    // 🔹 QUERY DB
    let products = await Product.find(query).sort(sortOption);

    // 🔹 RANDOM SHUFFLE (only if no sort applied)
    if (!sort) {
      products = products.sort(() => Math.random() - 0.5);
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: error.message });
  }
};




/* =========================
   USER: PRODUCT DETAIL
   ========================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isApproved: true,
    });

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN: APPROVE PRODUCT
   ========================= */
export const approveProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isApproved: true,
    });

    res.json({ message: "Product approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
