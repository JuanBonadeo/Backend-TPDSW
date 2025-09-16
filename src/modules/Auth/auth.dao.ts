import { PrismaClient, User } from '@prisma/client';
import { RegisterDto, UpdateProfileDto } from './auth.dtos.js';

export class AuthDAO {
    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findUserById(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { id },
            include: { 
                Favorite: {
                    include: {Movie: true}
                },
                Review: {
                    include: {Movie: true}
                },
                ToWatch: {
                    include: {Movie: true}
                },
                _count: { select: { Favorite: true, Review: true, ToWatch: true } }

            },

        });
    }

    async createUser(userData: RegisterDto & { password: string }): Promise<User> { // todo
        return await this.prisma.user.create({
            data: {
                ...userData,
                birth_date: userData.birth_date ? new Date(userData.birth_date) : null,
            }
        });
    }

    async updateUser(id: string, userData: UpdateProfileDto): Promise<User | null> {
        return await this.prisma.user.update({
            where: { id },
            data: userData,
        });
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
}