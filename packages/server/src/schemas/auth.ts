import { z } from 'zod';

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;

export const loginSchema = z.strictObject({
    email: z.email({ error: 'Invalid email' }).trim(),
    password: z.string().min(8),
});

export const signupSchema = loginSchema.extend({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string({ error: 'Invalid phone number' }).min(12),
});
