// src/realtime/socket/handlers/core.handlers.ts
import type { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types";

/**
 * Core handlers that are useful in almost every project:
 * - join a per-user room
 * - ping/pong health
 * - generic room join/leave helpers
 */
export function registerCoreHandlers(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) {
  io.on("connection", (socket) => {
    const userId = socket.data.user?.id;

    // Put the user into a predictable room for targeted emits:
    // io.to(`user:${userId}`).emit(...)
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.emit("server:ready", { now: new Date().toISOString() });

    socket.on("client:ping", (payload) => {
      // Example: you can add latency tracking here
      void payload;
      // no-op; client can also listen to built-in socket.io pings
    });

    socket.on("room:join", ({ room }) => {
      if (!room) return;
      socket.join(room);
    });

    socket.on("room:leave", ({ room }) => {
      if (!room) return;
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      // optional logging / cleanup hooks
    });
  });
}
