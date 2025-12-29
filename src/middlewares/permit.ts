import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/index";
import { RoleType } from "../interfaces/role.interface";

/**
 * Simple permission middleware - permit([RoleType.ADMIN])
 * @param allowedRoles - Array of roles that can access the route
 */
export const permit = (allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Check if user is authenticated (should be handled by auth middleware)
    if (!user) {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required")
      );
    }

    // Get user role from populated user data
    const userRole = user.role?.name as RoleType;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        new ApiError(HTTP_STATUS.FORBIDDEN, "Access denied")
      );
    }

    // User has required role - proceed
    next();
  };
};

// Convenience exports for common permissions
export const adminOnly = permit([RoleType.ADMIN]);
export const userOnly = permit([RoleType.USER]);
export const allUsers = permit([RoleType.ADMIN, RoleType.USER]);
