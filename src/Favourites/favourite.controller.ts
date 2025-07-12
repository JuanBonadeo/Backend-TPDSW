import { Request, Response } from "express";
import { FavouriteDAO } from "./favourite.dao.js";
import { FavouriteDTO, favouriteZodSchema } from "./favourite.interface.js";
import { internalServerErrorResponse, notFoundResponse, successResponse, zodErrorResponse } from "../utils/responseHandler.js";
import z from "zod";
import { MovieDAO } from "../Movies/movie.dao.js";


export class FavouriteController {
    private favouriteDao: FavouriteDAO;
    private moviesDao: MovieDAO
    constructor() {
        this.favouriteDao = new FavouriteDAO();
        this.moviesDao = new MovieDAO();
    }

    async createFavourite(req: Request, res: Response): Promise<FavouriteDTO | void> {
        const { id_user, id_movie } = req.body as FavouriteDTO;
        const validation = favouriteZodSchema.safeParse({ id_user, id_movie });
        if (!validation.success) {
            zodErrorResponse(res, "Datos de favorito inválidos", validation.error.errors);
            return;
        }
        try {
            const movieExists = await this.moviesDao.getById(id_movie);
            if (!movieExists) {
                notFoundResponse(res, "Película no encontrada");
                return;
            }
            const existingFavourite = await this.favouriteDao.getOne(id_user, id_movie);
            if (existingFavourite) {
                notFoundResponse(res, "El favorito ya existe");
                return;
            }
            const response = await this.favouriteDao.create(id_user, id_movie);
            if (!response) {
                internalServerErrorResponse(res, "Error al crear el favorito");
                return;
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
            if (!favourites || favourites.length === 0) {
                notFoundResponse(res, "No se encontraron favoritos para este usuario");
                return;
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
            const movieExists = await this.moviesDao.getById(id_movie);
            if (!movieExists) {
                notFoundResponse(res, "Película no encontrada");
                return;
            }
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

    async toggleFavourite(req: Request, res: Response): Promise<void> {
    const { id_user, id_movie } = req.body as FavouriteDTO;
    const validation = favouriteZodSchema.safeParse({ id_user, id_movie });
    if (!validation.success) {
        zodErrorResponse(res, "Datos de favorito inválidos", validation.error.errors);
        return;
    }
    try {
        const movieExists = await this.moviesDao.getById(id_movie);
        if (!movieExists) {
            notFoundResponse(res, "Película no encontrada");
            return;
        }
        
        const existingFavourite = await this.favouriteDao.getOne(id_user, id_movie);
        if (existingFavourite) {
            await this.favouriteDao.delete(id_user, id_movie);
            successResponse(res, { isFavourite: false }, "Favorito eliminado correctamente");
        } else {
            const response = await this.favouriteDao.create(id_user, id_movie);
            successResponse(res, { isFavourite: true }, "Favorito creado correctamente", 201);
        }
    } catch (error) {
        internalServerErrorResponse(res, "Error al procesar el favorito", error as any);
    }
}
}