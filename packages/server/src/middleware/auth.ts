import type { Response, NextFunction } from 'express';
import User from '../models/user/User';
import { verifyJwt } from '../helpers/jwt';
import ApiError from '../error/api';
import type { AuthRequest } from '../types/api';

export const authMiddleware = async (
    req: AuthRequest<unknown, unknown, unknown>,
    _: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return next(ApiError.forbidden('User is not authenticated'));
        }

        const payload = await verifyJwt(token);
        const user = await User.findByPk(payload.id as string, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return next(ApiError.forbidden('User is not found'));
        }

        req.user = user;
        next();
    } catch (e) {
        return next(ApiError.forbidden('Invalid token', e));
    }
};
