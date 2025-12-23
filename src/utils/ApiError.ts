// src/utils/ApiError.ts

export type ApiErrorDetails = Record<string, unknown> | null;

export default class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details: ApiErrorDetails;

  constructor(
    statusCode: number,
    message: string,
    details: ApiErrorDetails = null
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;

    // Ensure correct prototype chain (helps instanceof in some transpile targets)
    // Object.setPrototypeOf(this, new.target.prototype); :contentReference[oaicite:1]{index=1}

    // V8/Node: removes constructor frame from stack trace
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, ApiError); :contentReference[oaicite:2]{index=2}
    // }
  }
}
