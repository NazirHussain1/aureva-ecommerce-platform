require("./config/loadEnv");

const mongoose = require("mongoose");
const app = require("./app");
const { connectDB } = require("./config/mongodb");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
    logger.info("Shutdown complete");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! Shutting down...", err);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
      logger.info(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
