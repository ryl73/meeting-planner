import { Router } from 'express';
import { router as authRouter } from './auth';
import { router as userRouter } from './user';
import { router as meetingRouter } from './meeting';

export const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/meetings', meetingRouter);
