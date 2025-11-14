import { Router } from 'express';
import AuthController from '../../../controllers/auth';
import { validateRequest } from '../../../middleware/validateRequest';
import { loginSchema, signupSchema } from '../../../schemas/auth';

export const router = Router();

const authController = new AuthController();

router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);
