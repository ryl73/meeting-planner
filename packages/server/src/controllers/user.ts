import type { NextFunction, Response } from 'express';
import ApiError from '../error/api';
import type { AuthRequest } from '../types/api';
import BaseController from './base';

export default class UserController extends BaseController {
    get = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            res.status(200).json(req.user);
        } catch (e) {
            next(ApiError.badRequest('Failed to get user', e));
        }
    };
}
