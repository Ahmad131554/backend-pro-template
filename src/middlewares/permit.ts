import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/index";
import { RoleType } from "../types/roles.types";
import AppLogger from "../library/logger";

/**
 * Simple permission middleware - permit([RoleType.ADMIN])
 * @param allowedRoles - Array of roles that can access the route
 */
export const permit = (allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Check if user is authenticated
    if (!user) {
      AppLogger.security("Access attempt without authentication", "medium", {
        ip: req.ip,
        url: req.url,
      });
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required")
      );
    }

    const userRole = user.role.name as RoleType;
    // const userRole = (typeof user.role === 'object' && user.role.name) ? user.role.name as RoleType : user.role as RoleType;

    if (!allowedRoles.includes(userRole)) {
      AppLogger.security("Access denied - insufficient permissions", "high", {
        userId: user.id,
        userRole,
        requiredRoles: allowedRoles,
        ip: req.ip,
        url: req.url,
      });
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "Access denied - insufficient permissions"
        )
      );
    }

    // User has required role - proceed
    next();
  };
};

// Convenience exports for common permissions
export const adminOnly = permit([RoleType.ADMIN]);
export const usernly = permit([RoleType.USER]);
export const adminAndUser = permit([RoleType.ADMIN, RoleType.USER]);
export const allUsers = permit([RoleType.ADMIN, RoleType.USER]);
