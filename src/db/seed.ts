import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
  await prisma.movie_Actor.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.director.deleteMany();
  await prisma.category.deleteMany();

  console.log('🗑️  Datos anteriores eliminados');


  const categoriesData = [
    {
      name: 'Acción',
      description: 'Películas llenas de aventura, combates y secuencias de alto impacto'
    },
    {
      name: 'Drama',
      description: 'Películas centradas en el desarrollo de personajes y conflictos emocionales'
    },
    {
      name: 'Comedia',
      description: 'Películas diseñadas para entretener y hacer reír al público'
    },
    {
      name: 'Ciencia Ficción',
      description: 'Películas que exploran conceptos futuristas y tecnología avanzada'
    },
    {
      name: 'Terror',
      description: 'Películas diseñadas para asustar y crear tensión en el espectador'
    },
    {
      name: 'Romance',
      description: 'Películas centradas en relaciones amorosas y emociones románticas'
    },
    {
      name: 'Thriller',
      description: 'Películas de suspenso que mantienen al espectador en tensión'
    },
    {
      name: 'Aventura',
      description: 'Películas que siguen viajes épicos y expediciones emocionantes'
    },
    {
      name: 'Fantasía',
      description: 'Películas que incluyen elementos mágicos y mundos imaginarios'
    },
    {
      name: 'Animación',
      description: 'Películas creadas mediante técnicas de animación'
    }
  ];

  const categories = [];
  for (const categoryData of categoriesData) {
    const category = await prisma.category.create({
      data: categoryData
    });
    categories.push(category);
  }
  console.log('✅ Categorías creadas:', categories.length);

  const directorsData = [
    { first_name: 'Christopher', last_name: 'Nolan', nationality: 'Británico' },
    { first_name: 'Steven', last_name: 'Spielberg', nationality: 'Estadounidense' },
    { first_name: 'Quentin', last_name: 'Tarantino', nationality: 'Estadounidense' },
    { first_name: 'Martin', last_name: 'Scorsese', nationality: 'Estadounidense' },
    { first_name: 'Denis', last_name: 'Villeneuve', nationality: 'Canadiense' },
    { first_name: 'Greta', last_name: 'Gerwig', nationality: 'Estadounidense' },
    { first_name: 'Jordan', last_name: 'Peele', nationality: 'Estadounidense' },
    { first_name: 'Chloe', last_name: 'Zhao', nationality: 'China' },
    { first_name: 'Bong', last_name: 'Joon-ho', nationality: 'Surcoreano' },
    { first_name: 'Guillermo', last_name: 'del Toro', nationality: 'Mexicano' },
    { first_name: 'Ridley', last_name: 'Scott', nationality: 'Británico' },
    { first_name: 'David', last_name: 'Fincher', nationality: 'Estadounidense' }
  ];

  const directors = [];
  for (const directorData of directorsData) {
    const director = await prisma.director.create({
      data: directorData
    });
    directors.push(director);
  }
  console.log('✅ Directores creados:', directors.length);

  const moviesData = [
    // Películas de Christopher Nolan
    {
      title: 'Inception',
      description: 'Un ladrón que roba secretos corporativos a través del uso de tecnología de sueños compartidos.',
      duration: 148,
      release_date: 2010,
      rating: 8.8,
      director_last_name: 'Nolan',
      category_name: 'Ciencia Ficción'
    },
    {
      title: 'The Dark Knight',
      description: 'Batman se enfrenta al Joker, un criminal psicópata que busca sumir Gotham City en el caos.',
      duration: 152,
      release_date: 2008,
      rating: 9.0,
      director_last_name: 'Nolan',
      category_name: 'Acción'
    },
    {
      title: 'Interstellar',
      description: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio.',
      duration: 169,
      release_date: 2014,
      rating: 8.6,
      director_last_name: 'Nolan',
      category_name: 'Ciencia Ficción'
    },
    // Películas de Steven Spielberg
    {
      title: 'Jurassic Park',
      description: 'Un parque temático poblado con dinosaurios clonados se convierte en una pesadilla.',
      duration: 127,
      release_date: 1993,
      rating: 8.1,
      director_last_name: 'Spielberg',
      category_name: 'Aventura'
    },
    {
      title: 'Schindler\'s List',
      description: 'La verdadera historia de cómo Oskar Schindler salvó las vidas de más de mil judíos durante el Holocausto.',
      duration: 195,
      release_date: 1993,
      rating: 9.0,
      director_last_name: 'Spielberg',
      category_name: 'Drama'
    },
    // Películas de Quentin Tarantino
    {
      title: 'Pulp Fiction',
      description: 'Las vidas de dos sicarios, un boxeador y la esposa de un gángster se entrelazan.',
      duration: 154,
      release_date: 1994,
      rating: 8.9,
      director_last_name: 'Tarantino',
      category_name: 'Thriller'
    },
    {
      title: 'Django Unchained',
      description: 'Un esclavo liberado se embarca en una misión para rescatar a su esposa de un brutal propietario de plantación.',
      duration: 165,
      release_date: 2012,
      rating: 8.4,
      director_last_name: 'Tarantino',
      category_name: 'Acción'
    },
    // Películas de Martin Scorsese
    {
      title: 'Goodfellas',
      description: 'La historia de Henry Hill y su vida en la mafia desde la infancia hasta la adultez.',
      duration: 146,
      release_date: 1990,
      rating: 8.7,
      director_last_name: 'Scorsese',
      category_name: 'Drama'
    },
    {
      title: 'The Wolf of Wall Street',
      description: 'Basada en la historia real de Jordan Belfort, desde su ascenso hasta su caída.',
      duration: 180,
      release_date: 2013,
      rating: 8.2,
      director_last_name: 'Scorsese',
      category_name: 'Drama'
    },
    // Películas de Denis Villeneuve
    {
      title: 'Blade Runner 2049',
      description: 'Un joven blade runner descubre un secreto que lo lleva a buscar a Rick Deckard.',
      duration: 164,
      release_date: 2017,
      rating: 8.0,
      director_last_name: 'Villeneuve',
      category_name: 'Ciencia Ficción'
    },
    {
      title: 'Dune',
      description: 'Paul Atreides lidera una rebelión para liberar su planeta natal de una organización espía.',
      duration: 155,
      release_date: 2021,
      rating: 8.0,
      director_last_name: 'Villeneuve',
      category_name: 'Ciencia Ficción'
    },
    // Películas de Jordan Peele
    {
      title: 'Get Out',
      description: 'Un joven afroamericano visita la propiedad rural de la familia de su novia.',
      duration: 104,
      release_date: 2017,
      rating: 7.7,
      director_last_name: 'Peele',
      category_name: 'Terror'
    },
    {
      title: 'Us',
      description: 'Una familia se enfrenta a sus doppelgängers terroríficos.',
      duration: 116,
      release_date: 2019,
      rating: 6.8,
      director_last_name: 'Peele',
      category_name: 'Terror'
    },
    // Películas de Bong Joon-ho
    {
      title: 'Parasite',
      description: 'Una familia pobre se las ingenia para trabajar para una familia rica.',
      duration: 132,
      release_date: 2019,
      rating: 8.5,
      director_last_name: 'Joon-ho',
      category_name: 'Thriller'
    },
    // Películas de Guillermo del Toro
    {
      title: 'Pan\'s Labyrinth',
      description: 'En la España franquista, una niña escapa a un mundo de fantasía.',
      duration: 118,
      release_date: 2006,
      rating: 8.2,
      director_last_name: 'del Toro',
      category_name: 'Fantasía'
    },
    {
      title: 'The Shape of Water',
      description: 'Una mujer muda se enamora de una criatura anfibia en un laboratorio gubernamental.',
      duration: 123,
      release_date: 2017,
      rating: 7.3,
      director_last_name: 'del Toro',
      category_name: 'Romance'
    },
    // Películas de David Fincher
    {
      title: 'Fight Club',
      description: 'Un oficinista insomne forma un club de lucha clandestino.',
      duration: 139,
      release_date: 1999,
      rating: 8.8,
      director_last_name: 'Fincher',
      category_name: 'Drama'
    },
    {
      title: 'The Social Network',
      description: 'La historia de la creación de Facebook y las consecuencias legales que siguieron.',
      duration: 120,
      release_date: 2010,
      rating: 7.7,
      director_last_name: 'Fincher',
      category_name: 'Drama'
    },
    // Películas de Greta Gerwig
    {
      title: 'Lady Bird',
      description: 'Una estudiante de secundaria navega por una relación turbulenta con su madre.',
      duration: 94,
      release_date: 2017,
      rating: 7.4,
      director_last_name: 'Gerwig',
      category_name: 'Drama'
    },
    {
      title: 'Barbie',
      description: 'Barbie vive en Barbieland hasta que es expulsada por no ser una muñeca perfecta.',
      duration: 114,
      release_date: 2023,
      rating: 6.9,
      director_last_name: 'Gerwig',
      category_name: 'Comedia'
    }
  ];

  const movies = [];
  for (const movieData of moviesData) {
    const director = directors.find(d => d.last_name === movieData.director_last_name);
    const category = categories.find(c => c.name === movieData.category_name);
    
    const movie = await prisma.movie.create({
      data: {
        title: movieData.title,
        description: movieData.description,
        duration: movieData.duration,
        release_date: movieData.release_date,
        rating: movieData.rating,
        id_director: director!.id_director,
        id_category: category!.id_category
      }
    });
    movies.push(movie);
  }
  console.log('✅ Películas creadas:', movies.length);

  const actorsData = [
    { first_name: 'Leonardo', last_name: 'DiCaprio' },
    { first_name: 'Marion', last_name: 'Cotillard' },
    { first_name: 'Christian', last_name: 'Bale' },
    { first_name: 'Heath', last_name: 'Ledger' },
    { first_name: 'Matthew', last_name: 'McConaughey' },
    { first_name: 'Anne', last_name: 'Hathaway' },
    { first_name: 'Sam', last_name: 'Neill' },
    { first_name: 'Laura', last_name: 'Dern' },
    { first_name: 'Liam', last_name: 'Neeson' },
    { first_name: 'Ben', last_name: 'Kingsley' },
    { first_name: 'John', last_name: 'Travolta' },
    { first_name: 'Uma', last_name: 'Thurman' },
    { first_name: 'Jamie', last_name: 'Foxx' },
    { first_name: 'Christoph', last_name: 'Waltz' },
    { first_name: 'Robert', last_name: 'De Niro' },
    { first_name: 'Ray', last_name: 'Liotta' },
    { first_name: 'Jonah', last_name: 'Hill' },
    { first_name: 'Margot', last_name: 'Robbie' },
    { first_name: 'Ryan', last_name: 'Gosling' },
    { first_name: 'Harrison', last_name: 'Ford' },
    { first_name: 'Timothée', last_name: 'Chalamet' },
    { first_name: 'Zendaya', last_name: 'Coleman' },
    { first_name: 'Daniel', last_name: 'Kaluuya' },
    { first_name: 'Allison', last_name: 'Williams' },
    { first_name: 'Lupita', last_name: 'Nyong\'o' },
    { first_name: 'Winston', last_name: 'Duke' },
    { first_name: 'Song', last_name: 'Kang-ho' },
    { first_name: 'Lee', last_name: 'Sun-kyun' },
    { first_name: 'Ivana', last_name: 'Baquero' },
    { first_name: 'Sergi', last_name: 'López' },
    { first_name: 'Sally', last_name: 'Hawkins' },
    { first_name: 'Michael', last_name: 'Shannon' },
    { first_name: 'Brad', last_name: 'Pitt' },
    { first_name: 'Edward', last_name: 'Norton' },
    { first_name: 'Jesse', last_name: 'Eisenberg' },
    { first_name: 'Andrew', last_name: 'Garfield' },
    { first_name: 'Saoirse', last_name: 'Ronan' },
    { first_name: 'Laurie', last_name: 'Metcalf' },
    { first_name: 'Ryan', last_name: 'Reynolds' },
    { first_name: 'Guillermo', last_name: 'Francella' }
  ];

  const actors = [];
  for (const actorData of actorsData) {
    const actor = await prisma.actor.create({
      data: actorData
    });
    actors.push(actor);
  }
  console.log('✅ Actores creados:', actors.length);


  const movieActorData = [
    // Inception
    { movie_title: 'Inception', actor_first_name: 'Leonardo', actor_last_name: 'DiCaprio' },
    { movie_title: 'Inception', actor_first_name: 'Marion', actor_last_name: 'Cotillard' },
    
    // The Dark Knight
    { movie_title: 'The Dark Knight', actor_first_name: 'Christian', actor_last_name: 'Bale' },
    { movie_title: 'The Dark Knight', actor_first_name: 'Heath', actor_last_name: 'Ledger' },
    
    // Interstellar
    { movie_title: 'Interstellar', actor_first_name: 'Matthew', actor_last_name: 'McConaughey' },
    { movie_title: 'Interstellar', actor_first_name: 'Anne', actor_last_name: 'Hathaway' },
    
    // Jurassic Park
    { movie_title: 'Jurassic Park', actor_first_name: 'Sam', actor_last_name: 'Neill' },
    { movie_title: 'Jurassic Park', actor_first_name: 'Laura', actor_last_name: 'Dern' },
    
    // Schindler's List
    { movie_title: 'Schindler\'s List', actor_first_name: 'Liam', actor_last_name: 'Neeson' },
    { movie_title: 'Schindler\'s List', actor_first_name: 'Ben', actor_last_name: 'Kingsley' },
    
    // Pulp Fiction
    { movie_title: 'Pulp Fiction', actor_first_name: 'John', actor_last_name: 'Travolta' },
    { movie_title: 'Pulp Fiction', actor_first_name: 'Uma', actor_last_name: 'Thurman' },
    
    // Django Unchained
    { movie_title: 'Django Unchained', actor_first_name: 'Jamie', actor_last_name: 'Foxx' },
    { movie_title: 'Django Unchained', actor_first_name: 'Christoph', actor_last_name: 'Waltz' },
    
    // Goodfellas
    { movie_title: 'Goodfellas', actor_first_name: 'Robert', actor_last_name: 'De Niro' },
    { movie_title: 'Goodfellas', actor_first_name: 'Ray', actor_last_name: 'Liotta' },
    
    // The Wolf of Wall Street
    { movie_title: 'The Wolf of Wall Street', actor_first_name: 'Leonardo', actor_last_name: 'DiCaprio' },
    { movie_title: 'The Wolf of Wall Street', actor_first_name: 'Jonah', actor_last_name: 'Hill' },
    
    // Blade Runner 2049
    { movie_title: 'Blade Runner 2049', actor_first_name: 'Ryan', actor_last_name: 'Gosling' },
    { movie_title: 'Blade Runner 2049', actor_first_name: 'Harrison', actor_last_name: 'Ford' },
    
    // Dune
    { movie_title: 'Dune', actor_first_name: 'Timothée', actor_last_name: 'Chalamet' },
    { movie_title: 'Dune', actor_first_name: 'Zendaya', actor_last_name: 'Coleman' },
    
    // Get Out
    { movie_title: 'Get Out', actor_first_name: 'Daniel', actor_last_name: 'Kaluuya' },
    { movie_title: 'Get Out', actor_first_name: 'Allison', actor_last_name: 'Williams' },
    
    // Us
    { movie_title: 'Us', actor_first_name: 'Lupita', actor_last_name: 'Nyong\'o' },
    { movie_title: 'Us', actor_first_name: 'Winston', actor_last_name: 'Duke' },
    
    // Parasite
    { movie_title: 'Parasite', actor_first_name: 'Song', actor_last_name: 'Kang-ho' },
    { movie_title: 'Parasite', actor_first_name: 'Lee', actor_last_name: 'Sun-kyun' },
    
    // Pan's Labyrinth
    { movie_title: 'Pan\'s Labyrinth', actor_first_name: 'Ivana', actor_last_name: 'Baquero' },
    { movie_title: 'Pan\'s Labyrinth', actor_first_name: 'Sergi', actor_last_name: 'López' },
    
    // The Shape of Water
    { movie_title: 'The Shape of Water', actor_first_name: 'Sally', actor_last_name: 'Hawkins' },
    { movie_title: 'The Shape of Water', actor_first_name: 'Michael', actor_last_name: 'Shannon' },
    
    // Fight Club
    { movie_title: 'Fight Club', actor_first_name: 'Brad', actor_last_name: 'Pitt' },
    { movie_title: 'Fight Club', actor_first_name: 'Edward', actor_last_name: 'Norton' },
    
    // The Social Network
    { movie_title: 'The Social Network', actor_first_name: 'Jesse', actor_last_name: 'Eisenberg' },
    { movie_title: 'The Social Network', actor_first_name: 'Andrew', actor_last_name: 'Garfield' },
    
    // Lady Bird
    { movie_title: 'Lady Bird', actor_first_name: 'Saoirse', actor_last_name: 'Ronan' },
    { movie_title: 'Lady Bird', actor_first_name: 'Laurie', actor_last_name: 'Metcalf' },
    
    // Barbie
    { movie_title: 'Barbie', actor_first_name: 'Margot', actor_last_name: 'Robbie' },
    { movie_title: 'Barbie', actor_first_name: 'Ryan', actor_last_name: 'Reynolds' }
  ];

  const movieActorRelations = [];
  for (const relationData of movieActorData) {
    const movie = movies.find(m => m.title === relationData.movie_title);
    const actor = actors.find(a => 
      a.first_name === relationData.actor_first_name && 
      a.last_name === relationData.actor_last_name
    );
    
    if (movie && actor) {
      const relation = await prisma.movie_Actor.create({
        data: {
          id_movie: movie.id_movie,
          id_actor: actor.id_actor
        }
      });
      movieActorRelations.push(relation);
    }
  }
  console.log('✅ Relaciones película-actor creadas:', movieActorRelations.length);

  console.log(' Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });