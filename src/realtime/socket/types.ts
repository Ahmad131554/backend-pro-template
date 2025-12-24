// src/realtime/socket/types.ts
import type { JwtPayload } from "jsonwebtoken";

export type SocketUser = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export type AccessTokenPayload = JwtPayload & {
  sub: string; // user id
  role?: string;
};

export interface ServerToClientEvents {
  // Core
  "server:ready": (payload: { now: string }) => void;
  "server:error": (payload: { message: string }) => void;

  // Example pattern: notifications
  notify: (payload: { title: string; body: string }) => void;
}

export interface ClientToServerEvents {
  // Core
  "client:ping": (payload: { now: string }) => void;

  // Example pattern: join/leave rooms
  "room:join": (payload: { room: string }) => void;
  "room:leave": (payload: { room: string }) => void;
}

export interface InterServerEvents {
  // For multi-node setups later (e.g., Redis adapter)
  ping: () => void;
}

export interface SocketData {
  user?: SocketUser;
}
