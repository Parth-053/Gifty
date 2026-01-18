import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";

import { envConfig } from "./config/env.config.js";
import { corsOptions } from "./config/cors.config.js";
import { apiLimiter } from "./config/rateLimit.js";
import { logger } from "./config/logger.js";

// -- Import Routes (We will create these in next step) --
// import routes from "./routes/index.js";

const app = express();

// ======================================================
// 🛡️ Security & Performance Middleware
// ======================================================

// 1. Logger (HTTP Requests)
if (envConfig.env === "development") {
  app.use(morgan("dev"));
}

// 2. Helmet (Sets secure HTTP headers)
app.use(helmet());

// 3. CORS (Cross-Origin Resource Sharing)
app.use(cors(corsOptions));

// 4. Rate Limiting (Prevent Brute Force/DDoS)
app.use("/api", apiLimiter);

// 5. Compression (Gzip response bodies)
app.use(compression());

// 6. Body Parsers
app.use(express.json({ limit: "16kb" })); // Prevent large payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ======================================================
// 🚦 Routes
// ======================================================

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Gifty Backend" });
});

// Mount API Routes (Uncomment when routes are ready)
// app.use("/api/v1", routes);

// ======================================================
// ❌ Error Handling (Global)
// ======================================================

// 404 Handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    logger.error(err); // Log unexpected errors
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: envConfig.env === "development" ? err.stack : undefined
  });
});

export { app };