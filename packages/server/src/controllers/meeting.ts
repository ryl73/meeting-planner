import BaseController from './base';
import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../types/api';
import Meeting from '../models/meeting/Meeting';
import type {
    CreateMeetingSchema,
    UpdateMeetingSchema,
} from '../schemas/meeting';
import UserMeeting from '../models/joins/UserMeeting';
import ApiError from '../error/api';
import User from '../models/user/User';
import type { Order } from 'sequelize';

export default class MeetingController extends BaseController {
    create = async (
        req: AuthRequest<unknown, unknown, CreateMeetingSchema>,
        res: Response,
        next: NextFunction
    ) => {
        const { userIds } = req.body;
        const meetingId = await this.add<Meeting>(Meeting, req, res, next);

        const entries = userIds.map((userId) => ({
            meetingId,
            userId,
        }));

        await UserMeeting.bulkCreate(entries, {
            ignoreDuplicates: true,
            logging: true,
        }).catch((e) => {
            next(ApiError.badRequest('Failed to create', e));
        });
    };

    getById = async (
        req: AuthRequest<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const options = {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: { exclude: ['id', 'password', 'role'] },
                },
                {
                    model: User,
                    as: 'participants',
                    attributes: { exclude: ['id', 'password', 'role'] },
                    through: { attributes: [] },
                },
            ],
            attributes: { exclude: ['authorId'] },
        };
        await this.findById(Meeting, req, res, next, options);
    };

    getAll = async (
        req: AuthRequest<{ page: string; limit: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const { user } = req;

        const options = {
            order: [['startAt', 'ASC']] as Order,
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: { exclude: ['id', 'password', 'role'] },
                },
                {
                    model: User,
                    as: 'participants',
                    where: { id: user?.id },
                    attributes: [],
                    through: { attributes: [] },
                    required: true,
                },
            ],
            attributes: { exclude: ['authorId'] },
        };
        await this.findAndPaginate(Meeting, req, res, next, options);
    };

    deleteById = async (
        req: AuthRequest<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        await this.removeById(Meeting, req, res, next);
    };

    updateById = async (
        req: AuthRequest<{ id: string }, unknown, UpdateMeetingSchema>,
        res: Response,
        next: NextFunction
    ) => {
        await this.changeById(Meeting, req, res, next);
    };
}
