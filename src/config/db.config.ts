// src/config/db.ts
import mongoose from "mongoose";
import AppLogger from "../library/logger";
import { env } from "./env.config";

let connected = false;

export async function connectMongo(): Promise<typeof mongoose> {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (connected || mongoose.connection.readyState === 1) return mongoose;

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 30_000,
    });

    connected = true;
    AppLogger.info("MongoDB connected successfully");
    return mongoose;
  } catch (err) {
    AppLogger.error(`MongoDB connection failed:, ${err}`);
    throw err;
  }
}

export async function disconnectMongo(): Promise<void> {
  if (!connected && mongoose.connection.readyState === 0) return;

  try {
    // disconnect() closes all active connections created by mongoose.connect()
    await mongoose.disconnect();
    connected = false;
    console.log("MongoDB disconnected successfully");
  } catch (err) {
    console.error("Disconnecting MongoDB failed:", err);
    throw err;
  }
}
