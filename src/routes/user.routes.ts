import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireUser, requireOwnershipOrAdmin } from "../middlewares/permissions.js";
import { uploadProfilePicture, handleMulterError } from "../middlewares/upload.js";
import { userController } from "../controllers/index.js";

export const userRoutes = Router();

// Upload profile picture - requires authentication
userRoutes.post(
  "/profile-picture",
  authenticate,
  requireUser,
  uploadProfilePicture,
  handleMulterError,
  userController.uploadProfilePicture
);

// Get user profile - requires authentication
userRoutes.get(
  "/profile",
  authenticate,
  requireUser,
  userController.getProfile
);

// Update user profile - requires authentication
userRoutes.put(
  "/profile",
  authenticate,
  requireUser,
  userController.updateProfile
);

// Admin routes - get any user's profile
userRoutes.get(
  "/:userId",
  authenticate,
  requireOwnershipOrAdmin('userId'),
  userController.getProfile
);
