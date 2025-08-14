import { z } from 'zod';

export const userIdParamsSchema = z.string().min(1, 'ID es requerido');

export const createUserSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    name: z.string().min(1, 'El nombre es requerido'),
    birth_date: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
    role: z.enum(['USER', 'ADMIN', 'MODERATOR'], {
        errorMap: () => ({ message: 'El rol debe ser "USER", "ADMIN" o "MODERATOR"' })
    }).default('USER'),
    isActive: z.boolean().default(true)
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

export const toggleUserStatusSchema = z.object({
    isActive: z.boolean()
});

export const usersQuerySchema = z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    role: z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
    isActive: z.string().transform((val) => val === 'true').optional(),
    search: z.string().optional()
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ToggleUserStatusDto = z.infer<typeof toggleUserStatusSchema>;
export type UsersQueryDto = z.infer<typeof usersQuerySchema>;
export type UserParams = z.infer<typeof userIdParamsSchema>;

export interface UserResponseDto {
    id: string;
    email: string;
    name: string;
    birth_date: Date | null;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    image: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface UsersListResponseDto {
    users: UserResponseDto[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        limit: number;
    };
}