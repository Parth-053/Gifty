import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

// Config & Utils
import { envConfig } from "./config/env.config.js";
import { corsOptions } from "./config/cors.config.js";
import { apiLimiter } from "./config/rateLimit.js";
import { logger } from "./config/logger.js";

// Custom Middlewares
import { requestLogger } from "./middlewares/logger.middleware.js";
import { securityMiddleware, sanitizeInputs } from "./middlewares/security.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// Routes Import
import routes from "./routes/index.js";

const app = express();


// 1. Logging (Morgan + Winston)
app.use(requestLogger);

// 2. Security Headers (Helmet + XSS + MongoSanitize)
securityMiddleware(app);

// 3. CORS (Cross-Origin Resource Sharing)
app.use(cors(corsOptions));

// 4. Rate Limiting (Prevent Brute Force/DDoS)
app.use("/api", apiLimiter);

// 5. Data Sanitization (Prevent NoSQL Injection)
app.use(sanitizeInputs);

// 6. Compression (Gzip response bodies)
app.use(compression());

// 7. Body Parsers
app.use(express.json({ limit: "16kb" })); // Prevent large payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health Check (Public)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Gifty Backend", env: envConfig.env });
});

// Mount All API Routes
app.use("/api/v1", routes);

// 404 Handler (Route Not Found)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

export { app };