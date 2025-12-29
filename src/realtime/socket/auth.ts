// src/realtime/socket/auth.ts
import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.config";
import User from "../../models/user.model";
import ApiError from "../../utils/ApiError";
import type { AccessTokenPayload } from "../../interfaces/auth.interface";
import type { SocketData } from "./types";

function isAccessTokenPayload(value: unknown): value is AccessTokenPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "sub" in value &&
    typeof (value as any).sub === "string"
  );
}

/**
 * Socket.IO auth middleware:
 * - Client must send token in handshake auth: { token }
 * - We verify JWT and attach user to socket.data.user
 *
 * Client reference pattern:
 *   io("http://localhost:8003", { auth: { token } })
 * Socket.IO docs show handshake auth usage. :contentReference[oaicite:5]{index=5}
 */
export async function socketAuthMiddleware(
  socket: Socket<any, any, any, SocketData>,
  next: (err?: Error) => void
) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(
        new ApiError(401, "Authentication error", {
          general: "No token provided",
        })
      );
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!isAccessTokenPayload(decoded)) {
      return next(
        new ApiError(401, "Authentication error", {
          general: "Invalid token payload",
        })
      );
    }

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      return next(
        new ApiError(401, "Authentication error", { general: "User not found" })
      );
    }

    socket.data.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (err: any) {
    // jsonwebtoken uses these names for common failures. :contentReference[oaicite:6]{index=6}
    if (err?.name === "TokenExpiredError") {
      return next(
        new ApiError(401, "Authentication error", { general: "Token expired" })
      );
    }
    if (err?.name === "JsonWebTokenError") {
      return next(
        new ApiError(401, "Authentication error", { general: "Invalid token" })
      );
    }
    return next(err);
  }
}
