import { env } from "../config/env.config";
import { asyncHandler } from "../utils/asyncHandler";
import type { RequestHandler } from "express";
import type { AccessTokenPayload } from "../interfaces/auth.interface";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import User from "../models/user.model";
import AppLogger from "../library/logger";

function isAccessTokenPayload(value: unknown): value is AccessTokenPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "sub" in value &&
    typeof (value as any).sub === "string"
  );
}

export const authenticate: RequestHandler = asyncHandler(
  async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      AppLogger.security("Authentication attempt without token", "medium", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });
      throw new ApiError(401, "Authentication Failed: No token provided");
    }

    const token = authHeader.slice("Bearer ".length).trim();

    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!isAccessTokenPayload(decoded)) {
      throw new ApiError(401, "Authentication Failed: Invalid token payload");
    }

    const user = await User.findById(decoded.sub).select(
      "-password -resetPasswordOtp -resetPasswordOtpExpiry"
    );
    if (!user) {
      AppLogger.security("Authentication with invalid user ID", "high", {
        userId: decoded.sub,
        ip: req.ip,
      });
      throw new ApiError(401, "Authentication Failed: User not found");
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role || "user",
    };

    AppLogger.auth("User authenticated successfully", user._id.toString(), {
      method: req.method,
      url: req.url,
    });

    next();
  }
);
