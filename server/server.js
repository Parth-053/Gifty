import { app } from "./src/app.js";
import { envConfig } from "./src/config/env.config.js";
import { connectDB } from "./src/config/db.config.js";
import { logger } from "./src/config/logger.js";

// 1. Connect to Database
connectDB()
  .then(() => {
    // 2. Start Server only after DB connection success
    app.listen(envConfig.port, () => {
      logger.info(`🚀 Server running in ${envConfig.env} mode on port ${envConfig.port}`);
      logger.info(`   Local: http://localhost:${envConfig.port}`);
    });
  })
  .catch((err) => {
    logger.error("❌ MongoDB Connection Failed !!!", err);
    process.exit(1);
  });

// Handle Uncaught Exceptions 
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});

// Handle Unhandled Promise Rejections 
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  // Graceful shutdown
  process.exit(1);
});