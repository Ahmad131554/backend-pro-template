// Simple role types
export enum RoleType {
  ADMIN = 'admin',
  USER = 'user'
}

export type UserRole = RoleType.ADMIN | RoleType.USER;