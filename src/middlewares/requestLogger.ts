import type { Request, Response, NextFunction } from 'express';
import AppLogger from '../library/logger.js';

/**
 * Middleware to log all HTTP requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log the incoming request
  AppLogger.api(
    `${req.method} ${req.url}`,
    req.method,
    req.url,
    undefined,
    {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous'
    }
  );

  // Override res.end to log the response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): Response {
    const duration = Date.now() - startTime;
    
    AppLogger.api(
      `${req.method} ${req.url} - ${res.statusCode}`,
      req.method,
      req.url,
      res.statusCode,
      {
        duration: `${duration}ms`,
        contentLength: res.get('Content-Length') || '0',
        userId: req.user?.id || 'anonymous'
      }
    );

    // Call the original end method
    return originalEnd.call(this, chunk, encoding) as Response;
  };

  next();
};