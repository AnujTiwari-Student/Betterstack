import * as z from 'zod';

export const CreateWebsiteSchema = z.object({
  url: z.string(),
});

export type CreateWebsiteInput = z.infer<typeof CreateWebsiteSchema>;

export const CreateUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;