import { type UserAttributes } from '../models/user/User';
import type { NextFunction, Response } from 'express';
import ApiError from '../error/api';
import type { AuthRequest } from '../types/api';

export default class UserController {
    static async get(
        req: AuthRequest<unknown, unknown, UserAttributes>,
        res: Response,
        next: NextFunction
    ) {
        try {
            res.status(200).json(req.user);
        } catch (e) {
            next(ApiError.badRequest('Failed to get user', e));
        }
    }
}
