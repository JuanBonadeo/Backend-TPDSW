
// movie-actor.interface.ts
export interface CreateMovieActorDto {
    id_movie: number;
    id_actor: number;
    role: string;
}

export interface MovieActorResponse {
    id_movie: number;
    id_actor: number;
    role?: string;
    created_at?: Date;
    // Relaciones populadas
    Movie?: {
        id_movie: number;
        title: string;
    };
    Actor?: {
        id_actor: number;
        first_name: string;
        last_name: string;
    };
}