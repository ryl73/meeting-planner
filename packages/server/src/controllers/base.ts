import type { NextFunction, Request, Response } from 'express';
import {
    type FindAndCountOptions,
    type FindOptions,
    type ModelStatic,
    Op,
} from 'sequelize';
import type { Model } from 'sequelize-typescript';
import type { AuthRequest } from '../types/api';
import ApiError from '../error/api';

export type PaginationParams = {
    page?: string;
    limit?: string;
    [key: string]: any;
};

export type PaginationResult<T> = {
    data: T[];
    pagination: {
        total: number;
        page: number;
        pageCount: number;
        limit: number;
    };
};

export default abstract class BaseController {
    protected async add<T extends Model>(
        model: ModelStatic<T>,
        req: AuthRequest<unknown, unknown, T['_creationAttributes']>,
        res: Response,
        next: NextFunction
    ): Promise<string | void> {
        try {
            const result = await model.create({
                ...req.body,
                authorId: req.user?.id,
            });

            res.status(201).json({ id: result.id });
            return result.id;
        } catch (e) {
            next(ApiError.badRequest('Failed to create', e));
        }
    }

    protected async findAll<T extends Model>(
        model: ModelStatic<T>,
        res: Response,
        next: NextFunction,
        options: FindOptions = {}
    ) {
        try {
            const result = await model.findAll(options);

            res.status(200).json(result);
        } catch (e) {
            next(ApiError.badRequest('Failed to get all', e));
        }
    }

    protected async findAndPaginate<T extends Model>(
        model: ModelStatic<T>,
        req: AuthRequest<PaginationParams>,
        res: Response,
        next: NextFunction,
        options: FindAndCountOptions = {}
    ) {
        try {
            const { page: reqPage, limit: reqLimit } = req.params;
            const page = Math.max(1, Number(reqPage) || 1);
            const limit = Math.max(1, Number(reqLimit) || 10);
            const offset = (page - 1) * limit;

            const dynamicWhere: any = {};
            for (const key in req.params) {
                if (['page', 'limit'].includes(key)) continue;
                const value = req.params[key];
                if (value != null && value !== '') {
                    dynamicWhere[key] =
                        typeof value === 'string'
                            ? { [Op.iLike]: `%${value}%` }
                            : value;
                }
            }

            const { count, rows } = await model.findAndCountAll({
                ...options,
                where: {
                    ...dynamicWhere,
                    ...options.where,
                },
                limit,
                offset,
            });

            const result = {
                data: rows,
                pagination: {
                    total: count,
                    page,
                    pageCount: Math.ceil(count / limit),
                    limit,
                },
            };
            res.status(200).json(result);
        } catch (e) {
            next(ApiError.badRequest('Failed to get all', e));
        }
    }

    protected async findById<T extends Model>(
        model: ModelStatic<T>,
        req: AuthRequest<{ id: string }>,
        res: Response,
        next: NextFunction,
        options: FindOptions = {}
    ) {
        try {
            const { id } = req.params;

            const result = await model.findByPk(id, options);

            if (!result) {
                return next(ApiError.badRequest('Not found'));
            }

            res.status(200).json(result);
        } catch (e) {
            next(ApiError.badRequest('Failed to get', e));
        }
    }

    protected async removeById<T extends Model & { authorId: string }>(
        model: ModelStatic<T>,
        req: AuthRequest<{ id: string }>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            const result = await model.findByPk(id);

            if (!result) {
                return next(ApiError.notFound('Not found'));
            }

            if (req.user?.id !== result.authorId) {
                return next(
                    ApiError.forbidden('You are not permitted to delete this')
                );
            }

            await result.destroy();

            res.status(200).json({ message: 'Deleted' });
        } catch (e) {
            next(ApiError.badRequest('Failed to delete', e));
        }
    }

    protected async changeById<T extends Model & { authorId: string }>(
        model: ModelStatic<T>,
        req: AuthRequest<{ id: string }, unknown, T['_creationAttributes']>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            const result = await model.findByPk(id);

            if (!result) {
                return next(ApiError.notFound('Not found'));
            }

            if (req.user?.id !== result.authorId) {
                return next(
                    ApiError.forbidden('You are not permitted to update this')
                );
            }

            await result.update(req.body);

            res.status(200).json(result);
        } catch (e) {
            next(ApiError.badRequest('Failed to update', e));
        }
    }

    protected async getByField<
        T extends Model,
        K extends keyof T['_attributes'] & string,
    >(
        model: ModelStatic<T>,
        fieldName: K,
        req: Request<Record<K, string>>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const value = req.params[fieldName];

            if (value === undefined) {
                return next(ApiError.badRequest(`Missing param: ${fieldName}`));
            }

            const result = await model.findAll({
                where: { [fieldName]: value } as never,
            });

            res.status(200).json(result);
        } catch (e) {
            next(ApiError.badRequest(`Failed to get all by ${fieldName}`, e));
        }
    }
}
