import prisma from '../../db/db.js';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UsersQueryDto, UserResponseDto, UsersListResponseDto } from './user.dtos.js';

export class UserDAO {
    async getAll(query: UsersQueryDto): Promise<UsersListResponseDto> {
        const { page, limit, role, isActive, search } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        
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
            where: { id },
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
            where: { email }
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
        try {
            const user = await prisma.user.update({
                where: { id },
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
        } catch (error) {
            return null;
        }
    }

    async toggleStatus(id: string, isActive: boolean): Promise<UserResponseDto | null> {
        try {
            const user = await prisma.user.update({
                where: { id },
                data: { isActive },
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
        } catch (error) {
            return null;
        }
    }

    async softDelete(id: string): Promise<UserResponseDto | null> {
        return this.toggleStatus(id, false);
    }

    async hardDelete(id: string): Promise<boolean> {
        try {
            await prisma.user.delete({
                where: { id }
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
            prisma.user.count(),
            prisma.user.count({ where: { role: 'ADMIN' } }),
            prisma.user.count({ where: { role: 'USER' } }),
            prisma.user.count({ where: { role: 'MODERATOR' } }),
            prisma.user.count({ where: { isActive: true } }),
            prisma.user.count({ where: { isActive: false } })
        ]);

        return { total, admins, users, moderators, active, inactive };
    }
}