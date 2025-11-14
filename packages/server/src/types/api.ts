import User from '../models/user/User';
import type { Request } from 'express';

export type AuthRequest<Q = unknown, T = unknown, B = unknown> = Request<
    Q,
    T,
    B
> & {
    user?: User;
};
