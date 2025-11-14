import User from '../models/user/User';
import type { NextFunction, Request, Response } from 'express';
import ApiError from '../error/api';
import dotenv from 'dotenv';
import { signJwt } from '../helpers/jwt';
import BaseController from './base';
import type { LoginSchema, SignupSchema } from '../schemas/auth';

const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in seconds

dotenv.config();

const COOKIE_NAME = 'token';

export default class AuthController extends BaseController {
    signup = async (
        req: Request<unknown, unknown, SignupSchema>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email } = req.body;

            const exists = await User.findOne({ where: { email } });
            if (exists) {
                return next(ApiError.badRequest('User already exists'));
            }

            const user = await User.create(req.body);

            const token = await signJwt({ id: user.id });

            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: MAX_AGE,
            });

            res.status(200).json({ success: true });
        } catch (e) {
            next(ApiError.badRequest('Failed to signup', e));
        }
    };

    login = async (
        req: Request<unknown, unknown, LoginSchema>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.badRequest('Invalid email/password'));
            }

            const valid = await user.comparePassword(password);
            if (!valid) {
                return next(ApiError.badRequest('Invalid email/password'));
            }

            const token = await signJwt({ id: user.id });

            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: MAX_AGE,
            });

            res.json({ success: true });
        } catch (e) {
            next(ApiError.badRequest('Failed to login', e));
        }
    };

    logout = async (_: Request, res: Response) => {
        res.clearCookie(COOKIE_NAME);
        res.json({ success: true });
    };
}
