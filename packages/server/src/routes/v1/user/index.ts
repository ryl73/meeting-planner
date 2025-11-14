import { Router } from 'express';
import UserController from '../../../controllers/user';
import { authMiddleware } from '../../../middleware/auth';

export const router = Router();

const userController = new UserController();

router.get('/', authMiddleware, userController.get);
