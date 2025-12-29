import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { allUsers, adminOnly } from "../middlewares/permit.js";
import { userController } from "../controllers/index.js";
import { RoleType } from "../interfaces/role.interface.js";

export const userRoutes = Router();

// Get user profile - requires authentication
userRoutes.get("/profile", authenticate, allUsers, userController.getProfile);

// Update user profile - requires authentication
userRoutes.put(
  "/profile",
  authenticate,
  allUsers,
  userController.updateProfile
);

// Admin only - get any user's profile
userRoutes.get("/:userId", authenticate, adminOnly, userController.getProfile);
