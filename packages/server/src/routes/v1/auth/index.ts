import { Router } from 'express';
import AuthController from '../../../controllers/auth';

export const router = Router();

router.post('/signup', AuthController.signup);

router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);
