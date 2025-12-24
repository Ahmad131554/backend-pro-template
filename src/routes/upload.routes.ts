import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { allUsers } from "../middlewares/permit.js";
import {
  uploadProfilePicture,
  uploadDocument,
  handleMulterError,
} from "../middlewares/index.js";
import { uploadController } from "../controllers/index.js";

export const uploadRoutes = Router();

// Upload profile picture - public (no authentication required)
// IMPORTANT: This route must be defined BEFORE the authenticated route to avoid conflicts
uploadRoutes.post(
  "/profile-picture-public",
  uploadProfilePicture,
  handleMulterError,
  uploadController.uploadProfilePicturePublic
);

// Upload profile picture - requires authentication
uploadRoutes.post(
  "/profile-picture",
  authenticate,
  allUsers,
  uploadProfilePicture,
  handleMulterError,
  uploadController.uploadProfilePicture
);

// Upload document - requires authentication
uploadRoutes.post(
  "/document",
  authenticate,
  allUsers,
  uploadDocument,
  handleMulterError,
  uploadController.uploadDocument
);
