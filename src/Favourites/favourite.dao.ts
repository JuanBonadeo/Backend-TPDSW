import prisma from "../db/db.js";



export class FavouriteDao {  

  async createFavourite(id_user: number, id_movie: number): Promise<Favorite> {
    return prisma.favorite.create({
      data: {
        id_user,
        id_movie,
      },
    });
  }

}