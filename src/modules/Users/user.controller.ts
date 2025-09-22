import { Request, Response } from 'express';
import { UserDAO } from './user.dao.js';
import { createUserSchema, updateUserSchema, toggleUserStatusSchema, userIdParamsSchema, usersQuerySchema } from './user.dtos.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import { ErrorHandler, ConflictError, NotFoundError, ForbiddenError, BadRequestError } from '../../utils/ErrorHandler.js';
import { AuthUtils } from '../../utils/auth.js';

export class UserController {
    private dao: UserDAO;

    constructor() {
        this.dao = new UserDAO();
    }

    async getAll(req: Request, res: Response) {
        try {
            const query = usersQuerySchema.parse(req.query);
            const result = await this.dao.getAll(query);
            return ResponseHandler.paginated(res, result.users, result.pagination.totalUsers, result.pagination.currentPage, result.pagination.limit);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = userIdParamsSchema.parse(req.params.id);
            const currentUser = req.user!;
            
            if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
                throw new ForbiddenError('No tienes permiso para ver este usuario');
            }

            const user = await this.dao.getById(id);
            if (!user) {
                throw new NotFoundError('Usuario no encontrado');
            }
            return ResponseHandler.success(res, user);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const userData = createUserSchema.parse(req.body);
            
            const existingUser = await this.dao.getByEmail(userData.email);
            if (existingUser) {
                throw new ConflictError('Ya existe un usuario con este email');
            }

            const hashedPassword = await AuthUtils.hashPassword(userData.password);
            const newUser = await this.dao.create({
                ...userData,
                password: hashedPassword
            });

            return ResponseHandler.created(res, newUser);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = userIdParamsSchema.parse(req.params.id);
            const updateData = updateUserSchema.parse(req.body);
            const currentUser = req.user!;
            
            if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
                throw new ForbiddenError('No tienes permiso para actualizar este usuario');
            }

            if (currentUser.role !== 'ADMIN' && updateData.role) {
                delete updateData.role;
            }

            if (updateData.email) {
                const existingUser = await this.dao.getByEmail(updateData.email);
                if (existingUser && existingUser.id !== id) {
                    throw new ConflictError('Ya existe un usuario con este email');
                }
            }

            const updatedUser = await this.dao.update(id, updateData);
            if (!updatedUser) {
                throw new NotFoundError('Usuario no encontrado');
            }
            return ResponseHandler.success(res, updatedUser);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }   

    async delete(req: Request, res: Response) {
        try {
            const id = userIdParamsSchema.parse(req.params.id);
            const currentUser = req.user!;
            
            if (currentUser.userId === id) {
                throw new BadRequestError('No puedes eliminar  tu propia cuenta');
            }

            const success = await this.dao.delete(id);
            if (!success) {
                throw new NotFoundError('Usuario no encontrado o no se pudo eliminar');
            }
            return ResponseHandler.success(res, { deleted: true });
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getStats(req: Request, res: Response) {
        try {
            const stats = await this.dao.countByRole();
            return ResponseHandler.success(res, stats);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }
}