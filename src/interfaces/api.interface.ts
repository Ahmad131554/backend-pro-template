// Common API response types

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: Record<string, unknown> | null;
  statusCode: number;
  stack?: string; // Only in development
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;