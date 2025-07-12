import { Request, Response } from "express";
import { FavouriteDao } from "./favourite.dao.js";
import { FavouriteDTO, favouriteZodSchema } from "./favourite.interface.js";
import { internalServerErrorResponse, notFoundResponse, successResponse, zodErrorResponse } from "../utils/responseHandler.js";
import z from "zod";


export class FavouriteController {
    private favouriteDao: FavouriteDao;

    constructor() {
        this.favouriteDao = new FavouriteDao();
    }

    async createFavourite(req: Request, res: Response): Promise<FavouriteDTO | void> {
        const { id_user, id_movie } = req.body as FavouriteDTO;
        const data = { id_user, id_movie };
        const validation = favouriteZodSchema.safeParse(data);
        if (!validation.success) {
            zodErrorResponse(res, "Datos de favorito inválidos", validation.error.errors);
            return;
        }
        try {
            const favourite = await this.favouriteDao.getOne(id_user, id_movie);
            if (favourite) {
                notFoundResponse(res, "El favorito ya existe");
                return;
            }
            const response = await this.favouriteDao.create(id_user, id_movie);
            if (!response) {
                notFoundResponse(res, "Actor no encontrado");
                return
            }
            successResponse(res, response, "Favorito creado correctamente", 201);
        } catch (error) {
            internalServerErrorResponse(res, "Error al agregar el actor", error as any);
        }
    }

    async getFavouritesByUserId(req: Request, res: Response): Promise<FavouriteDTO[] | void> {
        const { id_user } = req.params;
        const idZodSchema = z.string().min(1, "El id del usuario es requerido");
        const validation = idZodSchema.safeParse(id_user);
        if (!validation.success) {
            zodErrorResponse(res, "ID de usuario inválido", validation.error.errors);
            return 
        }
        try {
            const favourites = await this.favouriteDao.getAllByUserId(id_user);
            if (!favourites){
                internalServerErrorResponse(res, "Error al obtener los favoritos")
            }
            successResponse(res, favourites, "Favoritos obtenidos correctamente");
        } catch (error) {
            internalServerErrorResponse(res, "Error al obtener los favoritos", error as any);
            return    
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const { id_user, id_movie } = req.body as FavouriteDTO;
        const validation = favouriteZodSchema.safeParse({ id_user, id_movie });
        if (!validation.success) {
            zodErrorResponse(res, "Datos de favorito inválidos", validation.error.errors);
            return;
        }
        try {
            const favourite = await this.favouriteDao.getOne(id_user, id_movie);
            if (!favourite) {
                notFoundResponse(res, "Favorito no encontrado");
                return;
            }
            await this.favouriteDao.delete(id_user, id_movie);
            successResponse(res, null, "Favorito eliminado correctamente");
        } catch (error) {
            internalServerErrorResponse(res, "Error al eliminar el favorito", error as any);
        }
    }
}