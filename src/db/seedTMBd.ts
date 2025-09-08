
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Bearer token de TMDB
const TMDB_BEARER_TOKEN: string | undefined = process.env.TMDB_BEARER_TOKEN;
const TMDB_BASE_URL: string = 'https://api.themoviedb.org/3';

if (!TMDB_BEARER_TOKEN) {
    console.error('❌ TMDB_BEARER_TOKEN no está configurada en las variables de entorno');
    process.exit(1);
}

// Interfaces para los tipos de datos
interface TMDBGenre {
    id: number;
    name: string;
}

interface TMDBGenresResponse {
    genres: TMDBGenre[];
}

interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    poster_path: string;
    backdrop_path: string;
    original_language: string;
    vote_count: number;
    popularity: number;
    adult: boolean;
}

interface TMDBMoviesResponse {
    results: TMDBMovie[];
}

interface TMDBMovieDetails extends TMDBMovie {
    runtime: number;
    genres: TMDBGenre[];
}

interface TMDBPerson {
    id: number;
    name: string;
    job?: string;
    character?: string;
    order?: number;
}

interface TMDBPersonDetails {
    id: number;
    name: string;
    profile_path: string;
    biography: string;
    birthday: string;
    place_of_birth: string;
    gender: number;
}

interface TMDBCreditsResponse {
    crew: TMDBPerson[];
    cast: TMDBPerson[];
}

interface ParsedName {
    first_name: string;
    last_name: string;
}

interface ActorWithRole {
    actor: any; // Tipo del modelo Prisma Actor
    character: string;
    order: number;
}

// Función para hacer peticiones a TMDB con Bearer token
async function fetchTMDB(endpoint: string): Promise<any> {
    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
    };

    const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }
    return response.json();
}

// Función para parsear nombres completos
function parseFullName(fullName: string): ParsedName {
    if (!fullName) return { first_name: '', last_name: '' };

    const parts: string[] = fullName.trim().split(' ');
    if (parts.length === 1) {
        return { first_name: parts[0], last_name: '' };
    }

    return {
        first_name: parts[0],
        last_name: parts.slice(1).join(' '),
    };
}

// Función para extraer nacionalidad del lugar de nacimiento
function extractNationality(birthPlace: string | null): string | null {
    if (!birthPlace) return null;

    const parts: string[] = birthPlace.split(',');
    const country: string = parts[parts.length - 1].trim();

    // Mapeo de países comunes
    const countryMap: Record<string, string> = {
        USA: 'Estadounidense',
        'United States': 'Estadounidense',
        UK: 'Británico',
        'United Kingdom': 'Británico',
        France: 'Francés',
        Germany: 'Alemán',
        Italy: 'Italiano',
        Spain: 'Español',
        Canada: 'Canadiense',
        Australia: 'Australiano',
        Japan: 'Japonés',
        'South Korea': 'Surcoreano',
        Mexico: 'Mexicano',
        Brazil: 'Brasileño',
        Argentina: 'Argentino',
    };

    return countryMap[country] || country;
}

async function cleanDatabase(): Promise<void> {
    console.log('🧹 Limpiando base de datos...');
    await prisma.review.deleteMany({});
    await prisma.favorite.deleteMany({});
    await prisma.movie_Actor.deleteMany({});
    await prisma.actor.deleteMany({});
    await prisma.movie.deleteMany({});
    await prisma.director.deleteMany({});
    await prisma.category.deleteMany({});
    
    // Reiniciar contadores de autoincrement en PostgreSQL
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Movie"', 'id_movie'), 1, false)`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Category"', 'id_category'), 1, false)`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Director"', 'id_director'), 1, false)`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Actor"', 'id_actor'), 1, false)`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Review"', 'id_review'), 1, false)`;
    
    console.log('✅ Base de datos limpiada y contadores reiniciados');
}// prisma/seed.ts

// Función para obtener y crear géneros
async function seedGenres(): Promise<any[]> {
    console.log('🎬 Seeding genres...');

    const genresData: TMDBGenresResponse = await fetchTMDB('/genre/movie/list');
    const genres: any[] = [];

    for (const genre of genresData.genres) {
        // Primero verificar por tmdb_id
        let existingGenre = await prisma.category.findUnique({
            where: { tmdb_id: genre.id },
        });

        // Si no existe por tmdb_id, verificar por nombre
        if (!existingGenre) {
            existingGenre = await prisma.category.findUnique({
                where: { name: genre.name },
            });
        }

        if (!existingGenre) {
            try {
                const createdGenre = await prisma.category.create({
                    data: {
                        name: genre.name,
                        tmdb_id: genre.id,
                        description: `Películas del género ${genre.name}`,
                    },
                });
                genres.push(createdGenre);
                console.log(`✅ Género creado: ${genre.name}`);
            } catch (error: any) {
                if (error.code === 'P2002') {
                    // Si aún hay conflicto, buscar el género existente y usarlo
                    console.log(`⚠️ Género ya existe: ${genre.name}, usando el existente`);
                    const existingByName = await prisma.category.findUnique({
                        where: { name: genre.name },
                    });
                    if (existingByName) {
                        genres.push(existingByName);
                    }
                } else {
                    throw error;
                }
            }
        } else {
            // Si el género existe pero no tiene tmdb_id, actualizarlo
            if (!existingGenre.tmdb_id && genre.id) {
                try {
                    existingGenre = await prisma.category.update({
                        where: { id_category: existingGenre.id_category },
                        data: { tmdb_id: genre.id },
                    });
                    console.log(`🔄 Actualizado tmdb_id para: ${genre.name}`);
                } catch (updateError) {
                    console.log(`⚠️ No se pudo actualizar tmdb_id para: ${genre.name}`);
                }
            }
            genres.push(existingGenre);
            console.log(`📋 Género encontrado: ${genre.name}`);
        }
    }

    console.log(`✅ ${genres.length} géneros procesados`);
    return genres;
}

// Función para crear o encontrar un director
async function createOrFindDirector(person: TMDBPerson): Promise<any> {
    const existingDirector = await prisma.director.findUnique({
        where: { tmdb_id: person.id },
    });

    if (existingDirector) {
        return existingDirector;
    }

    // Obtener detalles completos de la persona
    const personDetails: TMDBPersonDetails = await fetchTMDB(`/person/${person.id}`);
    const { first_name, last_name }: ParsedName = parseFullName(person.name);

    const director = await prisma.director.create({
        data: {
            first_name,
            last_name,
            tmdb_id: person.id,
            nationality: extractNationality(personDetails.place_of_birth),
            profile_path: personDetails.profile_path,
            biography: personDetails.biography,
            birth_date: personDetails.birthday ? new Date(personDetails.birthday) : null,
            birth_place: personDetails.place_of_birth,
        },
    });

    return director;
}

// Función para crear o encontrar un actor
async function createOrFindActor(person: TMDBPerson): Promise<any> {
    const existingActor = await prisma.actor.findUnique({
        where: { tmdb_id: person.id },
    });

    if (existingActor) {
        return existingActor;
    }

    // Obtener detalles completos de la persona
    const personDetails: TMDBPersonDetails = await fetchTMDB(`/person/${person.id}`);
    const { first_name, last_name }: ParsedName = parseFullName(person.name);

    const actor = await prisma.actor.create({
        data: {
            first_name,
            last_name,
            tmdb_id: person.id,
            profile_path: personDetails.profile_path,
            biography: personDetails.biography,
            birth_date: personDetails.birthday ? new Date(personDetails.birthday) : null,
            birth_place: personDetails.place_of_birth,
            gender: personDetails.gender,
        },
    });

    return actor;
}

// Función para obtener el director de una película
async function getMovieDirector(movieId: number): Promise<any> {
    const credits: TMDBCreditsResponse = await fetchTMDB(`/movie/${movieId}/credits`);
    const director: TMDBPerson | undefined = credits.crew.find(person => person.job === 'Director');

    if (!director) {
        // Director por defecto si no se encuentra
        return await createOrFindDirector({
            id: 0,
            name: 'Director Desconocido',
        });
    }

    return await createOrFindDirector(director);
}

// Función para obtener los actores principales de una película
async function getMovieActors(movieId: number): Promise<ActorWithRole[]> {
    const credits: TMDBCreditsResponse = await fetchTMDB(`/movie/${movieId}/credits`);
    const mainActors: TMDBPerson[] = credits.cast.slice(0, 5); // Solo los primeros 5 actores

    const actors: ActorWithRole[] = [];
    for (const castMember of mainActors) {
        const actor = await createOrFindActor(castMember);
        actors.push({
            actor,
            character: castMember.character || '',
            order: castMember.order || 0,
        });
    }

    return actors;
}

// Función para obtener detalles completos de una película
async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return await fetchTMDB(`/movie/${movieId}`);
}

// Función principal para crear películas
async function seedMovies(genres: any[]): Promise<any[]> {
    console.log('🎭 Seeding 300 películas más populares (sin contenido adulto)...');

    const moviesCreated: any[] = [];
    const TARGET_MOVIES = 300;
    const MOVIES_PER_PAGE = 20; // TMDB devuelve 20 películas por página
    let page = 1;

    while (moviesCreated.length < TARGET_MOVIES) {
        try {
            console.log(`📄 Obteniendo página ${page} de películas populares (discover)...`);
            
            // Usar discover/movie con filtros ya aplicados
            const endpoint = `/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=revenue.desc`;
            const moviesData: TMDBMoviesResponse = await fetchTMDB(endpoint);
            
            if (!moviesData.results || moviesData.results.length === 0) {
                console.log(`⚠️ No hay más películas en la página ${page}`);
                break;
            }

            for (const movie of moviesData.results) {
                if (moviesCreated.length >= TARGET_MOVIES) break;

                // Verificar si la película ya existe
                const existingMovie = await prisma.movie.findUnique({
                    where: { tmdb_id: movie.id },
                });

                if (existingMovie) {
                    console.log(`⏭️ Película ya existe: ${movie.title}`);
                    continue;
                }

                try {
                    console.log(`📽️ Procesando (${moviesCreated.length + 1}/${TARGET_MOVIES}): ${movie.title}`);

                    // Obtener detalles completos de la película
                    const movieDetails: TMDBMovieDetails = await getMovieDetails(movie.id);

                    // Encontrar la categoría principal (primer género)
                    const primaryGenre: TMDBGenre | undefined = movieDetails.genres[0];
                    const category = genres.find(g => g.tmdb_id === primaryGenre?.id) || genres[0];

                    // Obtener director
                    const director = await getMovieDirector(movie.id);

                    // Crear la película
                    const createdMovie = await prisma.movie.create({
                        data: {
                            title: movie.title,
                            description: movie.overview || '',
                            duration: movieDetails.runtime || 0,
                            release_date: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
                            rating: movie.vote_average,
                            tmdb_id: movie.id,
                            poster_path: movie.poster_path,
                            backdrop_path: movie.backdrop_path,
                            original_language: movie.original_language,
                            vote_count: movie.vote_count,
                            popularity: movie.popularity,
                            adult: false, // Ya está filtrado por el endpoint
                            id_director: director.id_director,
                            id_category: category.id_category,
                        },
                    });

                    // Obtener y crear actores
                    const actors: ActorWithRole[] = await getMovieActors(movie.id);

                    for (const actorData of actors) {
                        await prisma.movie_Actor.create({
                            data: {
                                id_movie: createdMovie.id_movie,
                                id_actor: actorData.actor.id_actor,
                                role: 'Actor',
                                character: actorData.character,
                                order: actorData.order,
                            },
                        });
                    }

                    moviesCreated.push(createdMovie);
                    console.log(`✅ Película creada: ${movie.title} (${moviesCreated.length}/${TARGET_MOVIES})`);

                    // Pausa para no sobrecargar la API
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                } catch (error: any) {
                    console.error(`❌ Error procesando película ${movie.title}:`, error.message);
                    // Continuar con la siguiente película en caso de error
                    continue;
                }
            }

            page++;
            
            // Pausa entre páginas
            await new Promise(resolve => setTimeout(resolve, 300));
            
        } catch (error: any) {
            console.error(`❌ Error obteniendo página ${page}:`, error.message);
            page++;
            
            // Si hay muchos errores consecutivos, salir del bucle
            if (page > 50) {
                console.error('❌ Demasiados errores, deteniendo la carga de películas');
                break;
            }
        }
    }

    console.log(`✅ ${moviesCreated.length} películas populares creadas de un objetivo de ${TARGET_MOVIES}`);
    return moviesCreated;
}

// Función principal
async function main(): Promise<void> {
    try {
        console.log('🚀 Iniciando seed de la base de datos con 300 películas populares...');

        // Uncomment this line if you want to clean the database before seeding
        await cleanDatabase();

        // Seed de géneros
        const genres = await seedGenres();

        // Seed de películas (con directores y actores)
        await seedMovies(genres);

        console.log('✨ Seed completado exitosamente!');
    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar el seed
main().catch((e: Error) => {
    console.error(e);
    process.exit(1);
});