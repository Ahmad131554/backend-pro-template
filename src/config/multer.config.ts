import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { APP_CONFIG } from "./constants.config.js";

// Upload configurations
export const UPLOAD_CONFIG = {
  // Directories
  PROFILE_PICTURES: path.join(process.cwd(), "public", "uploads", "profiles"),
  DOCUMENTS: path.join(process.cwd(), "public", "uploads", "documents"),

  // File size limits (in bytes)
  MAX_PROFILE_IMAGE_SIZE: APP_CONFIG.UPLOADS.MAX_FILE_SIZE, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB

  // Allowed file types
  ALLOWED_IMAGE_TYPES: APP_CONFIG.UPLOADS.ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

  // File limits
  MAX_FILES: 1,
} as const;

// Ensure upload directories exist
Object.values(UPLOAD_CONFIG).forEach((dir) => {
  if (typeof dir === "string" && dir.includes("uploads")) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_CONFIG.PROFILE_PICTURES);
  },
  filename: (req, file, cb) => {
    // const userId = req.user?.id ?? "anonymous";
    const timestamp = Date.now();
    const uid = randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${timestamp}-${uid}${ext}`;
    cb(null, filename);
  },
});

// Storage configuration for documents
const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_CONFIG.DOCUMENTS);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id ?? "anonymous";
    const timestamp = Date.now();
    const uid = randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${userId}-${timestamp}-${uid}${ext}`;
    cb(null, filename);
  },
});

// File filter for images
const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.mimetype as any)) {
    return cb(null, true);
  }
  return cb(
    new Error(
      `Invalid file type: Only ${UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.join(", ")} images are allowed`
    )
  );
};

// File filter for documents
const documentFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (UPLOAD_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(file.mimetype as any)) {
    return cb(null, true);
  }
  return cb(
    new Error("Invalid file type: Only PDF and Word documents are allowed")
  );
};

// Multer configurations
export const profilePictureUpload = multer({
  storage: profilePictureStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.MAX_PROFILE_IMAGE_SIZE,
    files: UPLOAD_CONFIG.MAX_FILES,
  },
});

export const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.MAX_DOCUMENT_SIZE,
    files: UPLOAD_CONFIG.MAX_FILES,
  },
});

// Legacy upload (for backward compatibility)
const legacyStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage: legacyStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
