import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { allUsers, adminOnly } from "../middlewares/permit";
import { userController } from "../controllers/index";

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
