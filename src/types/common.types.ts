// Common utility types
export type UserRole = 'admin' | 'user' | 'moderator';
export type Environment = 'development' | 'production' | 'test';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Permission-related types
export type Permission = 
  | 'user:read' 
  | 'user:write' 
  | 'user:delete'
  | 'admin:all'
  | 'moderator:manage';

export type TokenPayload = {
  sub: string;
  role: UserRole;
  permissions?: Permission[];
  iat?: number;
  exp?: number;
};