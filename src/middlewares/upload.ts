import type { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";
import { profilePictureUpload, documentUpload } from "../config/multer.config.js";
import { error } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants/index.js";
import AppLogger from "../library/logger.js";

/**
 * Middleware for uploading profile pictures
 */
export const uploadProfilePicture: RequestHandler = profilePictureUpload.single("profilePicture");

/**
 * Middleware for uploading documents
 */
export const uploadDocument: RequestHandler = documentUpload.single("document");

/**
 * Middleware for uploading multiple profile pictures (if needed)
 */
export const uploadMultipleProfilePictures: RequestHandler = profilePictureUpload.array("profilePictures", 5);

/**
 * Generic multer error handler middleware
 */
export const handleMulterError: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  // Log the upload error
  AppLogger.error("File upload error", {
    error: err.message,
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return error(res, HTTP_STATUS.BAD_REQUEST, "File too large. Please upload a smaller file", { 
          field: err.field,
          maxSize: "5MB for images, 10MB for documents"
        });

      case "LIMIT_FILE_COUNT":
        return error(res, HTTP_STATUS.BAD_REQUEST, "Too many files uploaded", { 
          field: err.field,
          maxFiles: "1 file at a time"
        });

      case "LIMIT_UNEXPECTED_FILE":
        return error(res, HTTP_STATUS.BAD_REQUEST, "Unexpected field name in file upload", { 
          field: err.field,
          expectedFields: ["profilePicture", "document"]
        });

      case "LIMIT_PART_COUNT":
        return error(res, HTTP_STATUS.BAD_REQUEST, "Too many parts in multipart form");

      case "LIMIT_FIELD_KEY":
        return error(res, HTTP_STATUS.BAD_REQUEST, "Field name too long");

      case "LIMIT_FIELD_VALUE":
        return error(res, HTTP_STATUS.BAD_REQUEST, "Field value too long");

      case "LIMIT_FIELD_COUNT":
        return error(res, HTTP_STATUS.BAD_REQUEST, "Too many fields");

      default:
        return error(res, HTTP_STATUS.BAD_REQUEST, "File upload failed", { error: err.message });
    }
  }

  // Handle custom file filter errors
  if (err && err.message) {
    return error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      "Invalid file type",
      { error: err.message }
    );
  }

  // If it's not a multer error, pass it to the next error handler
  next(err);
};