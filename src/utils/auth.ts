import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { admin } from 'better-auth/plugins'

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),

    secret: process.env.BETTER_AUTH_SECRET || 'default-secret',

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 días
        updateAge: 60 * 60 * 24, // actualizar cada día
    },
    // plugins: [
    //     admin()
    // ],
});
