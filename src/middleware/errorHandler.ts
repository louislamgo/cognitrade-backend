import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Centralised error handling middleware.
 *
 * Catches all errors thrown by route handlers and returns a consistent
 * JSON error shape. Sensitive stack traces are only included in development.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.status).json({
      status: err.status,
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Unexpected error
  console.error('[error]', err);

  const isDev = process.env.NODE_ENV === 'development';

  res.status(500).json({
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
    ...(isDev ? { detail: err.message, stack: err.stack } : {}),
  });
}

/**
 * 404 handler — must be registered after all other routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    status: 404,
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found.`,
  });
}
