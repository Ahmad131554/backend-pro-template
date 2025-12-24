import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { permit, allUsers, adminOnly } from "../middlewares/permit.js";
import { uploadProfilePicture, handleMulterError } from "../middlewares/index.js";
import { userController } from "../controllers/index.js";
import { RoleType } from "../types/roles.types.js";

export const userRoutes = Router();

// Upload profile picture - requires authentication
userRoutes.post(
  "/profile-picture",
  authenticate,
  allUsers,
  uploadProfilePicture,
  handleMulterError,
  userController.uploadProfilePicture
);

// Get user profile - requires authentication
userRoutes.get(
  "/profile",
  authenticate,
  allUsers,
  userController.getProfile
);

// Update user profile - requires authentication
userRoutes.put(
  "/profile",
  authenticate,
  allUsers,
  userController.updateProfile
);

// Admin only - get any user's profile
userRoutes.get(
  "/:userId",
  authenticate,
  adminOnly,
  userController.getProfile
);
