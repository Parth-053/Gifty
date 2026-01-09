import { app } from "./app.js";
import connectDB from "./config/db.config.js";
import { envConfig } from "./config/env.config.js";

// Handle Uncaught Exceptions (e.g., synchronous code errors)
// Prevents the server from running in an unpredictable state
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// =========================================================================
// 🚀 Server Initialization
// =========================================================================

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Start Express Server
    const server = app.listen(envConfig.port, () => {
      console.log(
        `\n⚙️  Server running in ${envConfig.nodeEnv} mode on port ${envConfig.port}`
      );
      console.log(`➜  http://localhost:${envConfig.port}/api/health\n`);
    });

    // Handle Unhandled Rejections (e.g., async promises failing)
    process.on("unhandledRejection", (err) => {
      console.error("❌ UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);
      // Gracefully close server first, then exit
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();