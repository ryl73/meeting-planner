import { z } from 'zod';

export type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingSchema = z.infer<typeof updateMeetingSchema>;

export const createMeetingSchema = z.strictObject({
    title: z.string().min(2),
    description: z.optional(z.string().min(2)),
    startAt: z.iso.datetime(),
    endAt: z.iso.datetime(),
    userIds: z.array(z.uuidv4()),
});

export const updateMeetingSchema = createMeetingSchema;
