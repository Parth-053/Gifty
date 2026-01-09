import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"; // Security Headers
import morgan from "morgan"; // Request Logger

import { envConfig } from "./config/env.config.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// --- Import Routes ---
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import addressRoutes from "./routes/address.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// =========================================================================
// 🛡️ Global Middlewares
// =========================================================================

// 1. Security Headers (Helps prevent XSS, Clickjacking, etc.)
app.use(helmet());

// 2. CORS (Cross-Origin Resource Sharing)
// 'credentials: true' is REQUIRED for cookies to work on Frontend
app.use(
  cors({
    origin: envConfig.corsOrigin,
    credentials: true,
  })
);

// 3. Body Parsing
app.use(express.json({ limit: "16kb" })); // Accept JSON
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Accept URL Encoded data

// 4. Cookie Parsing (To read secure HttpOnly tokens)
app.use(cookieParser());

// 5. Logging (Only in Development)
if (envConfig.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// 6. Static Files (For temp uploads if needed)
app.use(express.static("public"));

// =========================================================================
// 🚦 Routes Mounting
// =========================================================================

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running 🚀" });
});

// API V1 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/sellers", sellerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/products", productRoutes); // Public browsing + Seller management
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// =========================================================================
// ❌ Global Error Handling
// =========================================================================

// This must be the LAST middleware
app.use(errorHandler);

export { app };