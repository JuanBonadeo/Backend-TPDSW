
import prisma from '../../db/db.js';
import { User } from '@prisma/client';
import { RegisterDto, UpdateProfileDto } from './auth.dtos.js';

export class AuthDAO {
    async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    async findUserById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id },
            include: { 
                Favorite: {
                    include: {Movie: true}
                },
                Review: {
                    include: {Movie: true}
                },
                ToWatches: {
                    include: {Movie: true}
                },
                _count: { select: { Favorite: true, Review: true } }

            },

        });
    }

    async createUser(userData: RegisterDto & { password: string }): Promise<User> { // todo
        return await prisma.user.create({
            data: {
                ...userData,
                birth_date: userData.birth_date ? new Date(userData.birth_date) : null,
            }
        });
    }

    async updateUser(id: string, userData: UpdateProfileDto): Promise<User | null> {
        return await prisma.user.update({
            where: { id },
            data: userData,
        });
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
}