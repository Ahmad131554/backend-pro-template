import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/index.js";
import type { UserRole, Permission } from "../types/common.types.js";

// Role-based permission mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['admin:all', 'user:read', 'user:write', 'user:delete', 'moderator:manage'],
  moderator: ['user:read', 'user:write', 'moderator:manage'],
  user: ['user:read']
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required"));
    }

    const userRole = user.role as UserRole;
    
    if (!allowedRoles.includes(userRole)) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Insufficient permissions"));
    }

    next();
  };
};

/**
 * Middleware to check if user has specific permission
 */
export const requirePermission = (requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required"));
    }

    const userRole = user.role as UserRole;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    // Check if user has admin:all permission (superuser)
    if (userPermissions.includes('admin:all')) {
      return next();
    }

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Insufficient permissions"));
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource or has admin access
 */
export const requireOwnershipOrAdmin = (userIdField = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    if (!user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required"));
    }

    const userRole = user.role as UserRole;
    const isAdmin = userRole === 'admin';
    const isOwner = user.id === resourceUserId;

    if (!isOwner && !isAdmin) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Access denied: You can only access your own resources"));
    }

    next();
  };
};

// Convenience exports for common role checks
export const requireAdmin = requireRole(['admin']);
export const requireModerator = requireRole(['admin', 'moderator']);
export const requireUser = requireRole(['admin', 'moderator', 'user']);