export interface IRole {
  _id?: string;
  name: string; // 'user' or 'admin'
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Role enum for easy access
export enum RoleType {
  ADMIN = 'admin',
  USER = 'user'
}

export type UserRole = RoleType.ADMIN | RoleType.USER;