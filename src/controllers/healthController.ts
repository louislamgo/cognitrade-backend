import { Request, Response } from 'express';
import { HealthResponse } from '../types';
import packageJson from '../../package.json';

/**
 * GET /health
 *
 * Returns basic liveness/readiness information.
 */
export function healthCheck(_req: Request, res: Response): void {
  const body: HealthResponse = {
    status: 'ok',
    version: packageJson.version,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
  res.status(200).json(body);
}
