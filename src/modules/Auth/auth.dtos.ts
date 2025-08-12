// src/modules/auth/auth.dtos.ts
import z from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder los 100 caracteres'),
    email: z.string().email('Email inválido').max(255, 'El email no puede exceder los 255 caracteres'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    birth_date: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
    newPassword: z.string()
        .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'),
});

export const updateProfileSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder los 100 caracteres').optional(),
    birth_date: z.string().optional().transform((val) => {
        if (!val) return undefined;
        return new Date(val);
    }),
    image: z.string().url('URL de imagen inválida').optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;