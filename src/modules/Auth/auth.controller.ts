// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { AuthDAO } from './auth.dao.js';
import { registerSchema, loginSchema, changePasswordSchema, updateProfileSchema } from './auth.dtos.js';
import { AuthUtils } from '../../utils/auth.js';
import { ResponseHandler } from '../../utils/ResponseHandler.js';
import { ErrorHandler, ConflictError, UnauthorizedError, NotFoundError } from '../../utils/ErrorHandler.js';

export class AuthController {
    private dao: AuthDAO;

    constructor() {
        this.dao = new AuthDAO();
    }

    async register(req: Request, res: Response) {
        try {
            const userData = registerSchema.parse(req.body);
            
            const existingUser = await this.dao.findUserByEmail(userData.email);
            if (existingUser) {
                throw new ConflictError('El usuario ya existe con este email');
            }

            const hashedPassword = await AuthUtils.hashPassword(userData.password);
            
            const newUser = await this.dao.createUser({
                ...userData,
                password: hashedPassword,
            });

            const token = AuthUtils.generateToken({
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role ?? 'user',
            });

            return ResponseHandler.created(res, { user: newUser, token }, 'Usuario registrado exitosamente');
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = loginSchema.parse(req.body);
            
            // Buscar usuario
            const user = await this.dao.findUserByEmail(email);
            if (!user) {
                throw new UnauthorizedError('Credenciales inválidas');
            }

            // Verificar si el usuario está activo
            if (!user.isActive) {
                throw new UnauthorizedError('Cuenta desactivada');
            }

            // Verificar contraseña
            const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedError('Credenciales inválidas');
            }

            // Generar token
            const token = AuthUtils.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const { password: _, ...userWithoutPassword } = user;

            return ResponseHandler.success(res, {
                user: userWithoutPassword,
                token,
            }, 'Login exitoso');
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user!.userId;
            
            const user = await this.dao.findUserById(userId);
            if (!user) {
                throw new NotFoundError('Usuario no encontrado');
            }

            return ResponseHandler.success(res, user);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user!.userId;
            const updateData = updateProfileSchema.parse(req.body);
            
            const updatedUser = await this.dao.updateUser(userId, updateData);
            
            return ResponseHandler.success(res, updatedUser, 'Perfil actualizado exitosamente');
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const userId = req.user!.userId;
            const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
            
            // Obtener usuario con contraseña
            const user = await this.dao.findUserByEmail(req.user!.email);
            if (!user) {
                throw new NotFoundError('Usuario no encontrado');
            }

            // Verificar contraseña actual
            const isCurrentPasswordValid = await AuthUtils.comparePassword(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new UnauthorizedError('Contraseña actual incorrecta');
            }

            // Hashear nueva contraseña
            const hashedNewPassword = await AuthUtils.hashPassword(newPassword);
            
            // Actualizar contraseña
            await this.dao.updatePassword(userId, hashedNewPassword);

            return ResponseHandler.success(res, null, 'Contraseña cambiada exitosamente');
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }
}