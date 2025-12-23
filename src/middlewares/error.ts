import type { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError.js';
import { error } from '../utils/apiResponse.js';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

interface ValidationError extends Error {
  errors?: Record<string, { message?: string }>;
}

export function errorHandler(
  err: ApiError | MongoError | ValidationError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("❌ Error caught in middleware:", err);

  // Mongo duplicate key
  if ('code' in err && err.name === "MongoServerError" && err.code === 11000) {
    const mongoErr = err as MongoError;
    const errors: Record<string, string> = {};
    if (mongoErr.keyValue) {
      for (const key of Object.keys(mongoErr.keyValue)) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} already in use`;
      }
    }
    return error(res, 409, "Registration failed", errors);
  }

  // Mongoose validation errors
  if (err.name === "ValidationError" && 'errors' in err) {
    const validationErr = err as ValidationError;
    const formatted: Record<string, string> = {};
    if (validationErr.errors) {
      for (const [field, detail] of Object.entries(validationErr.errors)) {
        formatted[field] = detail?.message || "Invalid value";
      }
    }
    return error(res, 400, "Validation failed", formatted);
  }

  // If service or controller threw ApiError
  if (err instanceof ApiError) {
    return error(res, err.statusCode, err.message, err.details || {});
  }

  // Generic fallback
  const status = 'status' in err ? (err as any).status || 500 : 500;
  return error(res, status, err.message || "Internal Server Error", {
    general: err.message || "Something went wrong",
  });
}

export default errorHandler;