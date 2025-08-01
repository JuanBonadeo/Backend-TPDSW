import z from 'zod';

export const idParamsSchema = z
    .string()
    .transform((val: string) => parseInt(val))
    .pipe(z.number().int().positive('El ID debe ser un número positivo'))
    .describe('ID del ejercicio');

export const actorZodSchema = z.object({
    first_name: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no puede exceder los 50 caracteres'),
    last_name: z.string().min(1, 'El apellido es obligatorio').max(50, 'El apellido no puede exceder los 50 caracteres'),
    birth_date: z.date().optional(),
    tmdb_id: z.number().optional(),
    profile_path: z.string().max(500, 'La ruta del perfil no puede exceder los 500 caracteres').optional(),
    biography: z.string().max(2000, 'La biografía no puede exceder los 2000 caracteres').optional(),
    birth_place: z.string().max(200, 'El lugar de nacimiento no puede exceder los 200 caracteres').optional(),
    gender: z.number().min(0, 'El género debe ser 0, 1 o 2').max(2, 'El género debe ser 0, 1 o 2').optional(),
});

export const updateActorZodSchema = actorZodSchema.partial()


export type CreateActorDto = z.infer<typeof actorZodSchema>;
export type UpdateActorDto = z.infer<typeof updateActorZodSchema>;
export type ActorParams = z.infer<typeof idParamsSchema>;