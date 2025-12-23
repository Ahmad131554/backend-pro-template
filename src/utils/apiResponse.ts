// src/utils/apiResponse.ts
import type { Response } from "express";

export type ApiSuccessResponse<T = unknown> = {
  success: true;
  statusCode: number;
  message: string;
  data?: T;
};

export type ApiErrorResponse<
  E extends Record<string, unknown> = Record<string, unknown>,
> = {
  success: false;
  statusCode: number;
  message: string;
  errors?: E;
};

function hasKeys(value: unknown): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    Object.keys(value as object).length > 0
  );
}

export function apiResponse<T>(
  statusCode: number,
  data?: T,
  message?: string
): ApiSuccessResponse<T> {
  return {
    success: true,
    statusCode,
    message: message || "Success",
    ...(data !== undefined && { data })
  };
}

export function success<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    statusCode,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

export function error<E extends Record<string, unknown> | undefined>(
  res: Response,
  statusCode: number,
  message: string,
  errors?: E
): Response<ApiErrorResponse<NonNullable<E>>> {
  const response: ApiErrorResponse<NonNullable<E>> = {
    success: false,
    statusCode,
    message,
  };

  if (hasKeys(errors)) {
    response.errors = errors as NonNullable<E>;
  }

  return res.status(statusCode).json(response);
}
