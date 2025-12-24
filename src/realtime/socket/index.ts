// src/realtime/socket/index.ts
import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

import { env } from "../../config/env";
import { socketAuthMiddleware } from "./auth";
import { registerCoreHandlers } from "./handlers/core.handlers";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types";

/**
 * Keep a singleton reference so controllers/services can emit events without circular imports.
 */
let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> | null = null;

export function initSocket(httpServer: HttpServer) {
  if (io) return io;

  io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    path: env.SOCKET_PATH ?? "/socket.io",
    cors: {
      // Socket.IO requires explicit CORS config in v3+ :contentReference[oaicite:7]{index=7}
      origin: env.SOCKET_CORS_ORIGIN ?? "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Auth middleware (handshake-based). :contentReference[oaicite:8]{index=8}
  io.use(socketAuthMiddleware as any);

  // Register handlers (modular)
  registerCoreHandlers(io);

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error(
      "Socket.IO not initialized. Call initSocket(httpServer) before using getIO()."
    );
  }
  return io;
}
