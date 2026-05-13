import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

const router = Router();

/** GET /health — liveness probe */
router.get('/', healthCheck);

export default router;
