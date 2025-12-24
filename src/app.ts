import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "node:path";
import pinoHttp from "pino-http";

import { routesV1 } from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/error.js";
import { securityHeaders } from "./middlewares/security.js";
import AppLogger from "./library/logger.js";
import corsConfig from "./config/cors.config.js";

export function createApp() {
  const app = express();

  // Professional logging with pino-http
  app.use(
    pinoHttp({
      logger: AppLogger.getRawLogger(),
      customLogLevel: function (req, res, err) {
        if (res.statusCode >= 400 && res.statusCode < 500) {
          return "warn";
        } else if (res.statusCode >= 500 || err) {
          return "error";
        }
        return "info";
      },
      customSuccessMessage: function (req, res) {
        return `${req.method} ${req.url} - ${res.statusCode}`;
      },
      customErrorMessage: function (req, res, err) {
        return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
      },
    })
  );

  // Security headers
  app.use(securityHeaders);

  // Security / common middleware
  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // General rate limiting
  // app.use(generalRateLimit);

  // Serve uploaded files
  // Your upload middleware saves to: public/uploads/profiles
  // Your controller returns URLs like: /uploads/profiles/<filename>
  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "public", "uploads"))
  ); // :contentReference[oaicite:2]{index=2}

  // Health check route
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Routes
  app.use("/api/v1", routesV1);

  // 404 + error handling (should be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
