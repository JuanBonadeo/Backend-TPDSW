// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Bearer token de TMDB
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_BEARER_TOKEN) {
  console.error('❌ TMDB_BEARER_TOKEN no está configurada en las variables de entorno');
  process.exit(1);
}

// Función para hacer peticiones a TMDB con Bearer token
async function fetchTMDB(endpoint) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
    }
  };

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
  }
  return response.json();
}

// Función para parsear nombres completos
function parseFullName(fullName) {
  if (!fullName) return { first_name: '', last_name: '' };
  
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: '' };
  }
  
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(' ')
  };
}

// Función para extraer nacionalidad del lugar de nacimiento
function extractNationality(birthPlace) {
  if (!birthPlace) return null;
  
  const parts = birthPlace.split(',');
  const country = parts[parts.length - 1].trim();
  
  // Mapeo de países comunes
  const countryMap = {
    'USA': 'Estadounidense',
    'United States': 'Estadounidense',
    'UK': 'Británico',
    'United Kingdom': 'Británico',
    'France': 'Francés',
    'Germany': 'Alemán',
    'Italy': 'Italiano',
    'Spain': 'Español',
    'Canada': 'Canadiense',
    'Australia': 'Australiano',
    'Japan': 'Japonés',
    'South Korea': 'Surcoreano',
    'Mexico': 'Mexicano',
    'Brazil': 'Brasileño',
    'Argentina': 'Argentino'
  };
  
  return countryMap[country] || country;
}

// Función para limpiar datos existentes (opcional)
async function cleanDatabase() {
  console.log('🧹 Limpiando base de datos...');
  
  // Eliminar en orden para respetar las relaciones
  await prisma.movie_Actor.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.director.deleteMany();
  await prisma.category.deleteMany();
  
  console.log('✅ Base de datos limpiada');
}

// Función para obtener y crear géneros
async function seedGenres() {
  console.log('🎬 Seeding genres...');
  
  const genresData = await fetchTMDB('/genre/movie/list');
  const genres = [];
  
  for (const genre of genresData.genres) {
    // Primero verificar por tmdb_id
    let existingGenre = await prisma.category.findUnique({
      where: { tmdb_id: genre.id }
    });
    
    // Si no existe por tmdb_id, verificar por nombre
    if (!existingGenre) {
      existingGenre = await prisma.category.findUnique({
        where: { name: genre.name }
      });
    }
    
    if (!existingGenre) {
      try {
        const createdGenre = await prisma.category.create({
          data: {
            name: genre.name,
            tmdb_id: genre.id,
            description: `Películas del género ${genre.name}`
          }
        });
        genres.push(createdGenre);
        console.log(`✅ Género creado: ${genre.name}`);
      } catch (error) {
        if (error.code === 'P2002') {
          // Si aún hay conflicto, buscar el género existente y usarlo
          console.log(`⚠️ Género ya existe: ${genre.name}, usando el existente`);
          const existingByName = await prisma.category.findUnique({
            where: { name: genre.name }
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
            data: { tmdb_id: genre.id }
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
async function createOrFindDirector(person) {
  const existingDirector = await prisma.director.findUnique({
    where: { tmdb_id: person.id }
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
      birth_place: personDetails.place_of_birth
    }
  });
  
  return director;
}

// Función para crear o encontrar un actor
async function createOrFindActor(person) {
  const existingActor = await prisma.actor.findUnique({
    where: { tmdb_id: person.id }
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
      gender: personDetails.gender
    }
  });
  
  return actor;
}

// Función para obtener el director de una película
async function getMovieDirector(movieId) {
  const credits = await fetchTMDB(`/movie/${movieId}/credits`);
  const director = credits.crew.find(person => person.job === 'Director');
  
  if (!director) {
    // Director por defecto si no se encuentra
    return await createOrFindDirector({
      id: 0,
      name: 'Director Desconocido'
    });
  }
  
  return await createOrFindDirector(director);
}

// Función para obtener los actores principales de una película
async function getMovieActors(movieId) {
  const credits = await fetchTMDB(`/movie/${movieId}/credits`);
  const mainActors = credits.cast.slice(0, 5); // Solo los primeros 5 actores
  
  const actors = [];
  for (const castMember of mainActors) {
    const actor = await createOrFindActor(castMember);
    actors.push({
      actor,
      character: castMember.character,
      order: castMember.order
    });
  }
  
  return actors;
}

// Función para obtener detalles completos de una película
async function getMovieDetails(movieId) {
  return await fetchTMDB(`/movie/${movieId}`);
}

// Función principal para crear películas
async function seedMovies(genres) {
  console.log('🎭 Seeding movies...');
  
  const moviesCreated = [];
  
  // Obtener películas populares de diferentes páginas para tener variedad
  for (let page = 1; page <= 4; page++) {
    const moviesData = await fetchTMDB(`/movie/popular?page=${page}`);
    
    for (const movie of moviesData.results.slice(0, 18)) { // ~18 películas por página
      if (moviesCreated.length >= 70) break;
      
      // Verificar si la película ya existe
      const existingMovie = await prisma.movie.findUnique({
        where: { tmdb_id: movie.id }
      });
      
      if (existingMovie) continue;
      
      try {
        console.log(`📽️ Procesando: ${movie.title}`);
        
        // Obtener detalles completos de la película
        const movieDetails = await getMovieDetails(movie.id);
        
        // Encontrar la categoría principal (primer género)
        const primaryGenre = movieDetails.genres[0];
        const category = genres.find(g => g.tmdb_id === primaryGenre?.id) || genres[0];
        
        // Obtener director
        const director = await getMovieDirector(movie.id);
        
        // Crear la película
        const createdMovie = await prisma.movie.create({
          data: {
            title: movie.title,
            description: movie.overview,
            duration: movieDetails.runtime,
            release_date: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            rating: movie.vote_average,
            tmdb_id: movie.id,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            original_language: movie.original_language,
            vote_count: movie.vote_count,
            popularity: movie.popularity,
            adult: movie.adult,
            id_director: director.id_director,
            id_category: category.id_category
          }
        });
        
        // Obtener y crear actores
        const actors = await getMovieActors(movie.id);
        
        for (const actorData of actors) {
          await prisma.movie_Actor.create({
            data: {
              id_movie: createdMovie.id_movie,
              id_actor: actorData.actor.id_actor,
              role: 'Actor',
              character: actorData.character,
              order: actorData.order
            }
          });
        }
        
        moviesCreated.push(createdMovie);
        
        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 250));
        
      } catch (error) {
        console.error(`❌ Error procesando película ${movie.title}:`, error.message);
      }
    }
    
    if (moviesCreated.length >= 70) break;
  }
  
  console.log(`✅ ${moviesCreated.length} películas creadas`);
  return moviesCreated;
}

// Función principal
async function main() {
  try {
    console.log('🚀 Iniciando seed de la base de datos...');
    
    // Uncomment this line if you want to clean the database before seeding
    // await cleanDatabase();
    
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
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });