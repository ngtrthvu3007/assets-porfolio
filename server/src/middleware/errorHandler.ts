import type { ErrorRequestHandler, RequestHandler } from "express";

const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
const NOT_FOUND = "NOT_FOUND";

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  public constructor(statusCode: number, code: string, message: string) {
    super(message);

    this.code = code;
    this.statusCode = statusCode;
  }
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
  success: false;
}

class ErrorHandler {
  public readonly notFound: RequestHandler = (request, _response, next) => {
    next(new AppError(404, NOT_FOUND, `Route not found: ${request.path}`));
  };

  public readonly handle: ErrorRequestHandler = (
    error: unknown,
    _request,
    response,
    _next,
  ) => {
    const payload = this.buildPayload(error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;

    response.status(statusCode).json(payload);
  };

  private readonly buildPayload = (error: unknown): ErrorResponse => {
    const errorCode =
      error instanceof AppError ? error.code : INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError ? error.message : "Unexpected server error";

    return {
      error: {
        code: errorCode,
        message,
      },
      success: false,
    };
  };
}

export const errorHandler = new ErrorHandler();
