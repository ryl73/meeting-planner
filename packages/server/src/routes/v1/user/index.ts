import { Router } from 'express';
import UserController from '../../../controllers/user';
import { authMiddleware } from '../../../middleware/auth';

export const router = Router();

router.get('/', authMiddleware, UserController.get);
