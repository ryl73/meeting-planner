import type { ZodObject, ZodRawShape } from 'zod';
import type { AuthRequest } from '../types/api';
import type { NextFunction, Response } from 'express';
import ApiError from '../error/api';
import { z } from 'zod';

export const validateRequest =
    <S extends ZodObject<ZodRawShape>>(schema: S) =>
    (req: AuthRequest, _: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(
                ApiError.badRequest(
                    z.prettifyError(result.error),
                    z.formatError(result.error)
                )
            );
        }
        next();
    };
