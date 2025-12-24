// Database initialization script
import { initializeRoles } from "../models/role.model.js";
import AppLogger from "../library/logger.js";

export const initializeDatabase = async () => {
  try {
    // Initialize roles
    await initializeRoles();
    AppLogger.info("Database initialized successfully");
  } catch (error) {
    AppLogger.error("Failed to initialize database:", error);
    throw error;
  }
};