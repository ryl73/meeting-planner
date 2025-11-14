import { Router } from 'express';
import MeetingController from '../../../controllers/meeting';
import { validateRequest } from '../../../middleware/validateRequest';
import {
    createMeetingSchema,
    updateMeetingSchema,
} from '../../../schemas/meeting';
import { authMiddleware } from '../../../middleware/auth';

export const router = Router();

const meetingController = new MeetingController();

router.post(
    '/',
    authMiddleware,
    validateRequest(createMeetingSchema),
    meetingController.create
);
router.get('/', authMiddleware, meetingController.getAll);
router.get('/:id', authMiddleware, meetingController.getById);
router.delete('/:id', authMiddleware, meetingController.deleteById);
router.put(
    '/:id',
    authMiddleware,
    validateRequest(updateMeetingSchema),
    meetingController.updateById
);
