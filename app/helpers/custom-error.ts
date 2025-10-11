import logger from "./logger";

export class CustomError extends Error {
  statusCode?: number;
  errorType: string;
  timestamp: string;
  context?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode?: number,
    errorType: string = "CUSTOM_ERROR", // Default error type
    context?: Record<string, unknown>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.context = context;
    this.timestamp = new Date().toISOString();
    logger.error(
      {
        message,
        statusCode,
        errorType,
        context,
        timestamp: this.timestamp,
      },
      "CustomError",
    );
  }
}
