import pino from "pino";
import { env } from "../config/env.config";

// Create the main logger instance
const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  ...(env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        ignore: "pid,hostname",
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
      },
    },
  }),
  ...(env.NODE_ENV === "production" && {
    timestamp: pino.stdTimeFunctions.isoTime,
  }),
});

// Enhanced logger with additional methods
export class Logger {
  private static instance: Logger;
  private logger = logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Core logging methods
  public info(message: string, meta?: Record<string, any>) {
    this.logger.info(meta || {}, message);
  }

  public error(message: string, error?: Error | Record<string, any>) {
    if (error instanceof Error) {
      this.logger.error({ err: error }, message);
    } else {
      this.logger.error(error || {}, message);
    }
  }

  public warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(meta || {}, message);
  }

  public debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(meta || {}, message);
  }

  // Specialized logging methods
  public auth(message: string, userId?: string, meta?: Record<string, any>) {
    this.logger.info({ userId, type: "auth", ...meta }, message);
  }

  public api(
    message: string,
    method: string,
    url: string,
    statusCode?: number,
    meta?: Record<string, any>
  ) {
    this.logger.info(
      {
        type: "api",
        method,
        url,
        statusCode,
        ...meta,
      },
      message
    );
  }

  public database(
    message: string,
    operation?: string,
    meta?: Record<string, any>
  ) {
    this.logger.info(
      {
        type: "database",
        operation,
        ...meta,
      },
      message
    );
  }

  public security(
    message: string,
    level: "low" | "medium" | "high" = "medium",
    meta?: Record<string, any>
  ) {
    this.logger.warn(
      {
        type: "security",
        securityLevel: level,
        ...meta,
      },
      message
    );
  }

  public performance(
    message: string,
    duration?: number,
    meta?: Record<string, any>
  ) {
    this.logger.info(
      {
        type: "performance",
        duration,
        ...meta,
      },
      message
    );
  }

  // Get raw pino instance if needed
  public getRawLogger() {
    return this.logger;
  }
}

// Export singleton instance
export const AppLogger = Logger.getInstance();

// Export default logger for direct use
export default AppLogger;
