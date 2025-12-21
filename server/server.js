import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import sellerRoutes from "./src/routes/seller.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import wishlistRoutes from "./src/routes/wishlist.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import addressRoutes from "./src/routes/address.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";


const app = express();
const PORT = process.env.PORT || 5005;

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://localhost:5174", 
    ],
    credentials: true,
  })
);

/* ---------- BODY PARSER ---------- */
app.use(express.json());

/* ---------- DATABASE ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("🚀 Gifty Backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/notifications", notificationRoutes);


/* ---------- SERVER ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
