import type { Response } from 'express';
import type { ApiSuccessResponse, ApiErrorResponse } from '../interfaces/api.interface.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Send standardized success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = HTTP_STATUS.OK
): Response<ApiSuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data
  });
};

/**
 * Send standardized error response
 */
export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details: Record<string, unknown> | null = null
): Response<ApiErrorResponse> => {
  const response: ApiErrorResponse = {
    success: false,
    statusCode,
    message,
    details
  };

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  },
  message = 'Data retrieved successfully'
): Response => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    statusCode: HTTP_STATUS.OK,
    message,
    data,
    pagination
  });
};