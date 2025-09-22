import prisma from '../../db/db.js';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UsersQueryDto, UserResponseDto, UsersListResponseDto } from './user.dtos.js';

export class UserDAO {
    async getAll(query: UsersQueryDto): Promise<UsersListResponseDto> {
        const { page, limit, role, isActive, search } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            deleted_at: null
        };

        if (role) {
            where.role = role;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [users, totalUsers] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    birth_date: true,
                    role: true,
                    isActive: true,
                    emailVerified: true,
                    image: true,
                    created_at: true,
                    updated_at: true
                },
                orderBy: { created_at: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        return {
            users: users as UserResponseDto[],
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                limit
            }
        };
    }

    async getById(id: string): Promise<UserResponseDto | null> {
        const user = await prisma.user.findUnique({
            where: { id, deleted_at: null },
            select: {
                id: true,
                email: true,
                name: true,
                birth_date: true,
                role: true,
                isActive: true,
                emailVerified: true,
                image: true,
                created_at: true,
                updated_at: true
            }
        });

        return user as UserResponseDto | null;
    }

    async getByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email, deleted_at: null }
        });
    }

    async create(userData: CreateUserDto & { password: string }): Promise<UserResponseDto> {
        const user = await prisma.user.create({
            data: userData,
            select: {
                id: true,
                email: true,
                name: true,
                birth_date: true,
                role: true,
                isActive: true,
                emailVerified: true,
                image: true,
                created_at: true,
                updated_at: true
            }
        });

        return user as UserResponseDto;
    }

    async update(id: string, userData: UpdateUserDto): Promise<UserResponseDto | null> {

        const user = await prisma.user.update({
            where: { id, deleted_at: null },
            data: userData,
            select: {
                id: true,
                email: true,
                name: true,
                birth_date: true,
                role: true,
                isActive: true,
                emailVerified: true,
                image: true,
                created_at: true,
                updated_at: true
            }
        });

        return user as UserResponseDto;

    }


    async delete(id: string): Promise<boolean> {
        try {
            await prisma.user.update({
                where: { id },
                data: { deleted_at: new Date() },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async countByRole(): Promise<{
        total: number;
        admins: number;
        users: number;
        moderators: number;
        active: number;
        inactive: number
    }> {
        const [total, admins, users, moderators, active, inactive] = await Promise.all([
            prisma.user.count({ where: { deleted_at: null } }),
            prisma.user.count({ where: { role: 'ADMIN', deleted_at: null } }),
            prisma.user.count({ where: { role: 'USER', deleted_at: null } }),
            prisma.user.count({ where: { role: 'MODERATOR', deleted_at: null } }),
            prisma.user.count({ where: { isActive: true, deleted_at: null } }),
            prisma.user.count({ where: { isActive: false, deleted_at: null } })
        ]);

        return { total, admins, users, moderators, active, inactive };
    }
}