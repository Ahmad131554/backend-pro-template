// src/server.ts
import { createServer, type Server as HttpServer } from "node:http";

import { createApp } from "./app";
import { connectMongo, disconnectMongo } from "./config/db.config";
import { env } from "./config/env.config";
import AppLogger from "./library/logger";

// ------------------------------------------------------------
// OPTIONAL SOCKET.IO SETUP (Template-friendly)
// Uncomment these when you need realtime features.
// Socket.IO is typically attached to the HTTP server. :contentReference[oaicite:1]{index=1}
// ------------------------------------------------------------
// import { initSocket, getIO } from "./realtime/socket";

const app = createApp();

// Always use an HTTP server so enabling Socket.IO later is a one-line change. :contentReference[oaicite:2]{index=2}
const httpServer: HttpServer = createServer(app);

let shuttingDown = false;

async function startServer() {
  try {
    AppLogger.info("Starting server...");

    await connectMongo();
    AppLogger.info("Database connected successfully");

    // ------------------------------------------------------------
    // OPTIONAL: Initialize Socket.IO
    // initSocket(httpServer);
    // AppLogger.info("Socket.IO initialized");
    // ------------------------------------------------------------

    httpServer.listen(env.PORT, () => {
      AppLogger.info(`Server running on http://localhost:${env.PORT}`);
      AppLogger.info(`Environment: ${env.NODE_ENV}`);
      AppLogger.info(`Health check: http://localhost:${env.PORT}/health`);
      AppLogger.info(`API Base URL: http://localhost:${env.PORT}/api/v1`);
      // AppLogger.info("Socket.IO: enabled");
    });

    // Graceful shutdown guidance (SIGTERM): stop accepting new requests, finish in-flight, cleanup resources. :contentReference[oaicite:3]{index=3}
    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));

    process.on("unhandledRejection", (reason) => {
      AppLogger.error("Unhandled Rejection", reason as Error);
      void shutdown("SIGTERM");
    });

    process.on("uncaughtException", (err) => {
      AppLogger.error("Uncaught Exception", err);
      void shutdown("SIGTERM");
    });

    httpServer.on("error", (err) => {
      AppLogger.error("HTTP server error", err);
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

  AppLogger.info(`${signal} received... shutting down gracefully`);

  try {
    // ------------------------------------------------------------
    // OPTIONAL: Close Socket.IO (disconnect clients cleanly)
    // Socket.IO supports middlewares + lifecycle management. :contentReference[oaicite:4]{index=4}
    // try {
    //   getIO().close();
    //   AppLogger.info("Socket.IO closed successfully");
    // } catch {
    //   // ignore if sockets are not enabled
    // }
    // ------------------------------------------------------------

    await new Promise<void>((resolve, reject) => {
      httpServer.close((closeErr) => {
        if (closeErr) return reject(closeErr);
        return resolve();
      });
    });
    AppLogger.info("HTTP server closed successfully");

    await disconnectMongo();
    AppLogger.info("Database disconnected successfully");

    AppLogger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (err) {
    AppLogger.error("Error during shutdown", err as Error);
    process.exit(1);
  }
}

startServer();
