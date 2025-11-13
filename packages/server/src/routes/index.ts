import { Router } from 'express';
import { router as v1Router } from './v1';

export const router = Router();

router.use('/v1', v1Router);
