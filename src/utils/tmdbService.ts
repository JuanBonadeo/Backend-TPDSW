// lib/tmdbService.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDB(endpoint: string) {
  const res = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: { 
      Authorization: `Bearer ${TMDB_BEARER_TOKEN}`, 
      accept: "application/json" 
    }
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.statusText}`);
  return res.json();
}

// Función auxiliar para parsear nombres completos
function parseFullName(fullName: string) {
  if (!fullName) return { first_name: '', last_name: '' };
  
  const parts = fullName.trim().split(' ');
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
  
  const parts = birthPlace.split(',');
  const country = parts[parts.length - 1].trim();
  
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

// Función para crear o encontrar un director con todos los datos
async function createOrFindDirector(person: any) {
  const existingDirector = await prisma.director.findUnique({
    where: { tmdb_id: person.id },
  });
  
  if (existingDirector) {
    return existingDirector;
  }
  
  // Obtener detalles completos de la persona
  const personDetails = await fetchTMDB(`/person/${person.id}`);
  const { first_name, last_name } = parseFullName(person.name);
  
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

// Función para crear o encontrar un actor con todos los datos
async function createOrFindActor(person: any) {
  const existingActor = await prisma.actor.findUnique({
    where: { tmdb_id: person.id },
  });
  
  if (existingActor) {
    return existingActor;
  }
  
  // Obtener detalles completos de la persona
  const personDetails = await fetchTMDB(`/person/${person.id}`);
  const { first_name, last_name } = parseFullName(person.name);
  
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

/**
 * Carga las últimas películas populares desde TMDB
 * @param limit - Cantidad de películas a cargar (default: 20)
 * @param sortBy - Criterio de ordenamiento (default: 'popularity.desc')
 * Opciones:
 * - 'popularity.desc' - Más populares primero
 * - 'release_date.desc' - Más recientes primero
 * - 'vote_average.desc' - Mejor calificadas primero
 * - 'revenue.desc' - Mayor recaudación primero
 */
export async function fetchAndStoreLatestMovies(
  limit = 20, 
  sortBy: 'popularity.desc' | 'release_date.desc' | 'vote_average.desc' | 'revenue.desc' = 'popularity.desc'
) {
  console.log(`🎬 Cargando ${limit} películas ordenadas por ${sortBy}...`);

  // Endpoint con filtros y ordenamiento
  const endpoint = `/discover/movie?include_adult=false&sort_by=${sortBy}&language=en-US&page=1&vote_count.gte=100`;
  const data = await fetchTMDB(endpoint);

  // Buscar géneros existentes en la DB
  const genres = await prisma.category.findMany();

  const created: any[] = [];
  const skipped: string[] = [];

  for (const movie of data.results.slice(0, limit)) {
    // Si ya existe, saltar
    const exists = await prisma.movie.findUnique({ where: { tmdb_id: movie.id } });
    if (exists) {
      skipped.push(movie.title);
      continue;
    }

    try {
      console.log(`📽️ Procesando: ${movie.title} (${movie.release_date || 'Sin fecha'})`);

      // Obtener detalles para runtime y géneros
      const details = await fetchTMDB(`/movie/${movie.id}`);
      const primaryGenre = details.genres?.[0];
      const category = genres.find(g => g.tmdb_id === primaryGenre?.id) || genres[0];

      // Obtener créditos (director y actores)
      const credits = await fetchTMDB(`/movie/${movie.id}/credits`);
      
      // Buscar y crear director con todos sus datos
      const directorPerson = credits.crew.find((p: any) => p.job === "Director");
      let director;
      
      if (directorPerson) {
        director = await createOrFindDirector(directorPerson);
      } else {
        // Fallback a director genérico
        director = await createOrFindDirector({
          id: 0,
          name: 'Director Desconocido',
        });
      }

      // Crear película
      const createdMovie = await prisma.movie.create({
        data: {
          title: movie.title,
          description: movie.overview || "",
          duration: details.runtime || 0,
          release_date: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
          rating: movie.vote_average,
          tmdb_id: movie.id,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          original_language: movie.original_language,
          vote_count: movie.vote_count,
          popularity: movie.popularity,
          adult: false,
          id_director: director.id_director,
          id_category: category.id_category,
        },
      });

      // Obtener y crear actores principales con todos sus datos
      const mainActors = credits.cast.slice(0, 5);
      for (const castMember of mainActors) {
        const actor = await createOrFindActor(castMember);
        
        await prisma.movie_Actor.create({
          data: {
            id_movie: createdMovie.id_movie,
            id_actor: actor.id_actor,
            role: "Actor",
            character: castMember.character || "",
            order: castMember.order || 0,
          },
        });
      }

      created.push(createdMovie);
      console.log(`✅ Película creada: ${movie.title}`);

      // Pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 250));

    } catch (error: any) {
      console.error(`❌ Error procesando ${movie.title}:`, error.message);
      continue;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`✅ Películas creadas: ${created.length}`);
  console.log(`⏭️ Películas omitidas (ya existían): ${skipped.length}`);
  
  return created;
}

/**
 * Variante que combina películas recientes Y populares
 * Filtra películas de los últimos 6 meses y ordena por popularidad
 */
export async function fetchAndStoreRecentPopularMovies(limit = 20) {
  console.log(`🎬 Cargando ${limit} películas recientes y populares...`);

  // Calcular fecha de hace 6 meses
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const dateFilter = sixMonthsAgo.toISOString().split('T')[0];

  // Películas recientes ordenadas por popularidad
  const endpoint = `/discover/movie?include_adult=false&sort_by=popularity.desc&language=en-US&page=1&primary_release_date.gte=${dateFilter}&vote_count.gte=50`;
  
  const data = await fetchTMDB(endpoint);

  // Reutilizar la lógica de la función principal
  const genres = await prisma.category.findMany();
  const created: any[] = [];

  for (const movie of data.results.slice(0, limit)) {
    const exists = await prisma.movie.findUnique({ where: { tmdb_id: movie.id } });
    if (exists) continue;

    try {
      console.log(`📽️ Procesando: ${movie.title} (Popularidad: ${movie.popularity.toFixed(0)})`);

      const details = await fetchTMDB(`/movie/${movie.id}`);
      const primaryGenre = details.genres?.[0];
      const category = genres.find(g => g.tmdb_id === primaryGenre?.id) || genres[0];

      const credits = await fetchTMDB(`/movie/${movie.id}/credits`);
      const director = credits.crew.find((p: any) => p.job === "Director");
      let directorId: number;

      if (director) {
        const existingDirector = await prisma.director.findUnique({ 
          where: { tmdb_id: director.id } 
        });
        
        if (existingDirector) {
          directorId = existingDirector.id_director;
        } else {
          const nameParts = director.name.split(" ");
          const d = await prisma.director.create({
            data: {
              tmdb_id: director.id,
              first_name: nameParts[0] || "Desconocido",
              last_name: nameParts.slice(1).join(" ") || ""
            }
          });
          directorId = d.id_director;
        }
      } else {
        const d = await prisma.director.upsert({
          where: { tmdb_id: 0 },
          update: {},
          create: { tmdb_id: 0, first_name: "Desconocido", last_name: "" }
        });
        directorId = d.id_director;
      }

      const createdMovie = await prisma.movie.create({
        data: {
          title: movie.title,
          description: movie.overview || "",
          duration: details.runtime || 0,
          release_date: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
          rating: movie.vote_average,
          tmdb_id: movie.id,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          original_language: movie.original_language,
          vote_count: movie.vote_count,
          popularity: movie.popularity,
          adult: false,
          id_director: directorId,
          id_category: category.id_category,
        },
      });

      const mainActors = credits.cast.slice(0, 5);
      for (const a of mainActors) {
        const nameParts = a.name.split(" ");
        const existingActor = await prisma.actor.upsert({
          where: { tmdb_id: a.id },
          update: {},
          create: {
            tmdb_id: a.id,
            first_name: nameParts[0] || "Desconocido",
            last_name: nameParts.slice(1).join(" ") || "",
          },
        });

        await prisma.movie_Actor.create({
          data: {
            id_movie: createdMovie.id_movie,
            id_actor: existingActor.id_actor,
            role: "Actor",
            character: a.character || "",
            order: a.order || 0,
          },
        });
      }

      created.push(createdMovie);
      console.log(`✅ Película creada: ${movie.title}`);

      await new Promise(resolve => setTimeout(resolve, 250));

    } catch (error: any) {
      console.error(`❌ Error procesando ${movie.title}:`, error.message);
      continue;
    }
  }

  console.log(`\n✅ ${created.length} películas recientes y populares creadas`);
  return created;
}