import type { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

import { error } from "../utils/apiResponse";

// Upload directory: public/uploads/profiles
const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");

// Ensure upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id ?? "anonymous";
    const timestamp = Date.now();
    const uid = randomUUID();

    // Note: extension is not a security check; it's just for naming.
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${userId}-${timestamp}-${uid}${ext}`;

    cb(null, filename);
  },
});

const allowedMimeTypes = new Set<string>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Invalid file type: Only JPEG, PNG, GIF, and WebP images are allowed"
    )
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

export const uploadProfilePicture: RequestHandler =
  upload.single("profilePicture");

export const handleMulterError: ErrorRequestHandler = (
  err,
  _req,
  res,
  next
) => {
  // Multer limit/field errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return error(res, 400, "File size exceeded", {
        general: "File too large. Maximum size is 5MB",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return error(res, 400, "File limit reached", {
        general: "Too many files. Only 1 file is allowed",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return error(res, 400, "Invalid field", {
        general:
          "Unexpected field name. Use 'profilePicture' as the field name",
      });
    }

    return error(res, 400, "File upload failed", {
      general: err.message,
    });
  }

  // FileFilter or other upload errors
  if (err) {
    const message = err instanceof Error ? err.message : "Invalid file upload";
    return error(res, 400, "File upload failed", { general: message });
  }

  return next();
};
