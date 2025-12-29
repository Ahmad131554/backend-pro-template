import type { CorsOptions } from "cors";
import { env } from "./env.config";

// CORS configuration for different environments
const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // In development, allow all origins
    if (env.NODE_ENV === "development") {
      return callback(null, true);
    }

    // In production, define allowed origins
    const allowedOrigins = [
      "http://localhost:3000", // React dev server
      "http://localhost:5173", // Vite dev server
      "http://localhost:4200", // Angular dev server
      "https://yourdomain.com", // Your production frontend
      "https://www.yourdomain.com",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 200, // For legacy browser support
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-HTTP-Method-Override",
  ],
  exposedHeaders: ["X-Total-Count"], // Headers that client can access
  maxAge: 0, // Cache preflight response for 24 hours
};

// maxAge: 86400  // once stable apis, set back to 86400

export default corsConfig;
