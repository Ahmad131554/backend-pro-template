// src/server.ts
import type { Server } from "node:http";

import { createApp } from "./app.js";
import { connectMongo, disconnectMongo } from "./config/db.config.js";
import { env } from "./config/env.config.js";
import AppLogger from "./library/logger.js";

const app = createApp();

let server: Server | undefined;
let shuttingDown = false;

async function startServer() {
  try {
    AppLogger.info("🚀 Starting server...");
    
    await connectMongo();
    AppLogger.info("✅ Database connected successfully");

    server = app.listen(env.PORT, () => {
      AppLogger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      AppLogger.info(`📱 Environment: ${env.NODE_ENV}`);
      AppLogger.info(`🔗 Health check: http://localhost:${env.PORT}/health`);
      AppLogger.info(`📚 API Base URL: http://localhost:${env.PORT}/api/v1`);
    });

    // Graceful shutdown on termination signals (typical for PM2/K8s/systemd). :contentReference[oaicite:3]{index=3}
    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));

    // Optional: if you want "let it crash" behavior, keep these minimal and exit after cleanup.
    process.on("unhandledRejection", (reason) => {
      AppLogger.error("Unhandled Rejection", reason as Error);
      void shutdown("SIGTERM");
    });

    process.on("uncaughtException", (err) => {
      AppLogger.error("Uncaught Exception", err);
      void shutdown("SIGTERM");
    });
  } catch (err) {
    AppLogger.error("Failed to start server", err as Error);
    process.exit(1);
  }
}

async function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return;
  shuttingDown = true;

  AppLogger.info(`💫 ${signal} received... shutting down gracefully`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((closeErr) => {
          if (closeErr) return reject(closeErr);
          return resolve();
        });
      });
      AppLogger.info("✅ Server closed successfully");
    }

    await disconnectMongo();
    AppLogger.info("✅ Database disconnected successfully");

    AppLogger.info("🎯 Graceful shutdown completed");
    process.exit(0);
  } catch (err) {
    AppLogger.error("❌ Error during shutdown", err as Error);
    process.exit(1);
  }
}

startServer();
