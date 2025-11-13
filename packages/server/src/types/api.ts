import type { UserAttributes } from '../models/user/User';
import type { Request } from 'express';

export type AuthRequest<Q, T, B> = Request<Q, T, B> & {
    user?: UserAttributes;
};
