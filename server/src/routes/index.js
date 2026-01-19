import { Router } from "express";
import authRoutes from "./v1/auth.routes.js";
import userRoutes from "./v1/user.routes.js";
import sellerRoutes from "./v1/seller.routes.js";
import productRoutes from "./v1/product.routes.js";
import cartRoutes from "./v1/cart.routes.js";
import orderRoutes from "./v1/order.routes.js";
import addressRoutes from "./v1/address.routes.js";
import paymentRoutes from "./v1/payment.routes.js"; 
import adminRoutes from "./v1/admin.routes.js";
import reviewRoutes from "./v1/review.routes.js";
import wishlistRoutes from "./v1/wishlist.routes.js";
import aiRoutes from "./v1/ai.routes.js";
import categoryRoutes from "./v1/category.routes.js";
import bannerRoutes from "./v1/banner.routes.js";

const router = Router();

// Mount Routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/address", addressRoutes); 
router.use("/seller", sellerRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/admin", adminRoutes);
router.use("/reviews", reviewRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/ai", aiRoutes);
router.use("/categories", categoryRoutes);
router.use("/banners", bannerRoutes);

export default router;