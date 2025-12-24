// Simple role types
export enum RoleType {
  ADMIN = 'admin',
  MODERATOR = 'moderator', 
  USER = 'user'
}

export type UserRole = RoleType.ADMIN | RoleType.MODERATOR | RoleType.USER;