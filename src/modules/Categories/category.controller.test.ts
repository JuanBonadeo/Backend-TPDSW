import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { CategoryController } from './category.controller.js';
import { CategoryDAO } from './category.dao.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';

// Mock del DAO y ResponseHandler
vi.mock('./category.dao.js');
vi.mock('../../utils/responseHandler.js');
vi.mock('../../utils/ErrorHandler.js');

describe('CategoryController', () => {
    let controller: CategoryController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockDao: any;

    beforeEach(() => {
        // Reiniciar mocks antes de cada test
        vi.clearAllMocks();

        // Crear instancia del controller
        controller = new CategoryController();

        // Obtener el mock del DAO
        mockDao = vi.mocked(controller['dao']);

        // Mock del response de Express
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };

        // Mock del request de Express
        mockRequest = {};

        // Mock del ResponseHandler
        vi.mocked(ResponseHandler.success).mockReturnValue(mockResponse as any);
        // mock del error handler si es necesario
        vi.mocked(NotFoundError).mockReturnValue(mockResponse as any);
    });

    it('debería retornar todas las categorías exitosamente', async () => {
        // Arrange: Preparar datos de prueba
        const mockCategories = [
            {
                id_category: 1,
                name: 'Acción',
                description: 'Películas de acción',
                created_at: new Date('2025-01-01'),
                updated_at: new Date('2025-01-01'),
                deleted_at: null,
            },
            {
                id_category: 2,
                name: 'Comedia',
                description: 'Películas de comedia',
                created_at: new Date('2025-01-02'),
                updated_at: new Date('2025-01-02'),
                deleted_at: null,
            },
        ];

        // Configurar el mock del DAO para retornar las categorías
        mockDao.getAll.mockResolvedValue(mockCategories);

        // Act: Ejecutar el método a testear
        await controller.getAll(mockRequest as Request, mockResponse as Response);

        // Assert: Verificar el comportamiento esperado
        expect(mockDao.getAll).toHaveBeenCalledTimes(1);
        expect(ResponseHandler.success).toHaveBeenCalledWith(mockResponse, mockCategories);
    });

    it('debería retornar NotFound si la categoría no existe', async () => {
        // Arrange: Preparar datos de prueba
        const categoryId = 999;
        mockRequest.params = { id: categoryId.toString() };

        // Configurar el mock del DAO para retornar null (categoría no encontrada)
        mockDao.getOne.mockResolvedValue(new NotFoundError());

        // Act: Ejecutar el método a testear
        await controller.getOne(mockRequest as Request, mockResponse as Response);

        // Assert: Verificar el comportamiento esperado
        expect(mockDao.getOne).toHaveBeenCalledWith(categoryId);
        expect(NotFoundError).toHaveBeenCalled();
    });
});
