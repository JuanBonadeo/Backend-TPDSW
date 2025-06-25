import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes (opcional)
  await prisma.movie.deleteMany();
  await prisma.director.deleteMany();
  await prisma.category.deleteMany();

  console.log('🗑️  Datos anteriores eliminados');

  // Crear Categorías
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Acción',
        description: 'Películas llenas de aventura, combates y secuencias de alto impacto'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Drama',
        description: 'Películas centradas en el desarrollo de personajes y conflictos emocionales'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Comedia',
        description: 'Películas diseñadas para entretener y hacer reír al público'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Ciencia Ficción',
        description: 'Películas que exploran conceptos futuristas y tecnología avanzada'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Terror',
        description: 'Películas diseñadas para asustar y crear tensión en el espectador'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Romance',
        description: 'Películas centradas en relaciones amorosas y emociones románticas'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Thriller',
        description: 'Películas de suspenso que mantienen al espectador en tensión'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Aventura',
        description: 'Películas que siguen viajes épicos y expediciones emocionantes'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Fantasía',
        description: 'Películas que incluyen elementos mágicos y mundos imaginarios'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Animación',
        description: 'Películas creadas mediante técnicas de animación'
      }
    })
  ]);

  console.log('✅ Categorías creadas:', categories.length);

  // Crear Directores
  const directors = await Promise.all([
    prisma.director.create({
      data: {
        first_name: 'Christopher',
        last_name: 'Nolan',
        nationality: 'Británico'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Steven',
        last_name: 'Spielberg',
        nationality: 'Estadounidense'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Quentin',
        last_name: 'Tarantino',
        nationality: 'Estadounidense'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Martin',
        last_name: 'Scorsese',
        nationality: 'Estadounidense'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Denis',
        last_name: 'Villeneuve',
        nationality: 'Canadiense'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Greta',
        last_name: 'Gerwig',
        nationality: 'Estadounidense'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Jordan',
        last_name: 'Peele',
        nationality: 'Estadounidense'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Chloe',
        last_name: 'Zhao',
        nationality: 'China'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Bong',
        last_name: 'Joon-ho',
        nationality: 'Surcoreano'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Guillermo',
        last_name: 'del Toro',
        nationality: 'Mexicano'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'Ridley',
        last_name: 'Scott',
        nationality: 'Británico'
      }
    }),
    prisma.director.create({
      data: {
        first_name: 'David',
        last_name: 'Fincher',
        nationality: 'Estadounidense'
      }
    })
  ]);

  console.log('✅ Directores creados:', directors.length);

  // Crear Películas
  const movies = await Promise.all([
    // Películas de Christopher Nolan
    prisma.movie.create({
      data: {
        title: 'Inception',
        description: 'Un ladrón que roba secretos corporativos a través del uso de tecnología de sueños compartidos.',
        duration: 148,
        release_date: 2010,
        rating: 8.8,
        id_director: directors.find(d => d.last_name === 'Nolan')!.id_director,
        id_category: categories.find(c => c.name === 'Ciencia Ficción')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'The Dark Knight',
        description: 'Batman se enfrenta al Joker, un criminal psicópata que busca sumir Gotham City en el caos.',
        duration: 152,
        release_date: 2008,
        rating: 9.0,
        id_director: directors.find(d => d.last_name === 'Nolan')!.id_director,
        id_category: categories.find(c => c.name === 'Acción')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Interstellar',
        description: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio.',
        duration: 169,
        release_date: 2014,
        rating: 8.6,
        id_director: directors.find(d => d.last_name === 'Nolan')!.id_director,
        id_category: categories.find(c => c.name === 'Ciencia Ficción')!.id_category
      }
    }),

    // Películas de Steven Spielberg
    prisma.movie.create({
      data: {
        title: 'Jurassic Park',
        description: 'Un parque temático poblado con dinosaurios clonados se convierte en una pesadilla.',
        duration: 127,
        release_date: 1993,
        rating: 8.1,
        id_director: directors.find(d => d.last_name === 'Spielberg')!.id_director,
        id_category: categories.find(c => c.name === 'Aventura')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Schindler\'s List',
        description: 'La verdadera historia de cómo Oskar Schindler salvó las vidas de más de mil judíos durante el Holocausto.',
        duration: 195,
        release_date: 1993,
        rating: 9.0,
        id_director: directors.find(d => d.last_name === 'Spielberg')!.id_director,
        id_category: categories.find(c => c.name === 'Drama')!.id_category
      }
    }),

    // Películas de Quentin Tarantino
    prisma.movie.create({
      data: {
        title: 'Pulp Fiction',
        description: 'Las vidas de dos sicarios, un boxeador y la esposa de un gángster se entrelazan.',
        duration: 154,
        release_date: 1994,
        rating: 8.9,
        id_director: directors.find(d => d.last_name === 'Tarantino')!.id_director,
        id_category: categories.find(c => c.name === 'Thriller')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Django Unchained',
        description: 'Un esclavo liberado se embarca en una misión para rescatar a su esposa de un brutal propietario de plantación.',
        duration: 165,
        release_date: 2012,
        rating: 8.4,
        id_director: directors.find(d => d.last_name === 'Tarantino')!.id_director,
        id_category: categories.find(c => c.name === 'Acción')!.id_category
      }
    }),

    // Películas de Martin Scorsese
    prisma.movie.create({
      data: {
        title: 'Goodfellas',
        description: 'La historia de Henry Hill y su vida en la mafia desde la infancia hasta la adultez.',
        duration: 146,
        release_date: 1990,
        rating: 8.7,
        id_director: directors.find(d => d.last_name === 'Scorsese')!.id_director,
        id_category: categories.find(c => c.name === 'Drama')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'The Wolf of Wall Street',
        description: 'Basada en la historia real de Jordan Belfort, desde su ascenso hasta su caída.',
        duration: 180,
        release_date: 2013,
        rating: 8.2,
        id_director: directors.find(d => d.last_name === 'Scorsese')!.id_director,
        id_category: categories.find(c => c.name === 'Drama')!.id_category
      }
    }),

    // Películas de Denis Villeneuve
    prisma.movie.create({
      data: {
        title: 'Blade Runner 2049',
        description: 'Un joven blade runner descubre un secreto que lo lleva a buscar a Rick Deckard.',
        duration: 164,
        release_date: 2017,
        rating: 8.0,
        id_director: directors.find(d => d.last_name === 'Villeneuve')!.id_director,
        id_category: categories.find(c => c.name === 'Ciencia Ficción')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Dune',
        description: 'Paul Atreides lidera una rebelión para liberar su planeta natal de una organización espía.',
        duration: 155,
        release_date: 2021,
        rating: 8.0,
        id_director: directors.find(d => d.last_name === 'Villeneuve')!.id_director,
        id_category: categories.find(c => c.name === 'Ciencia Ficción')!.id_category
      }
    }),

    // Películas de Jordan Peele
    prisma.movie.create({
      data: {
        title: 'Get Out',
        description: 'Un joven afroamericano visita la propiedad rural de la familia de su novia.',
        duration: 104,
        release_date: 2017,
        rating: 7.7,
        id_director: directors.find(d => d.last_name === 'Peele')!.id_director,
        id_category: categories.find(c => c.name === 'Terror')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Us',
        description: 'Una familia se enfrenta a sus doppelgängers terroríficos.',
        duration: 116,
        release_date: 2019,
        rating: 6.8,
        id_director: directors.find(d => d.last_name === 'Peele')!.id_director,
        id_category: categories.find(c => c.name === 'Terror')!.id_category
      }
    }),

    // Películas de Bong Joon-ho
    prisma.movie.create({
      data: {
        title: 'Parasite',
        description: 'Una familia pobre se las ingenia para trabajar para una familia rica.',
        duration: 132,
        release_date: 2019,
        rating: 8.5,
        id_director: directors.find(d => d.last_name === 'Joon-ho')!.id_director,
        id_category: categories.find(c => c.name === 'Thriller')!.id_category
      }
    }),

    // Películas de Guillermo del Toro
    prisma.movie.create({
      data: {
        title: 'Pan\'s Labyrinth',
        description: 'En la España franquista, una niña escapa a un mundo de fantasía.',
        duration: 118,
        release_date: 2006,
        rating: 8.2,
        id_director: directors.find(d => d.last_name === 'del Toro')!.id_director,
        id_category: categories.find(c => c.name === 'Fantasía')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'The Shape of Water',
        description: 'Una mujer muda se enamora de una criatura anfibia en un laboratorio gubernamental.',
        duration: 123,
        release_date: 2017,
        rating: 7.3,
        id_director: directors.find(d => d.last_name === 'del Toro')!.id_director,
        id_category: categories.find(c => c.name === 'Romance')!.id_category
      }
    }),

    // Películas de David Fincher
    prisma.movie.create({
      data: {
        title: 'Fight Club',
        description: 'Un oficinista insomne forma un club de lucha clandestino.',
        duration: 139,
        release_date: 1999,
        rating: 8.8,
        id_director: directors.find(d => d.last_name === 'Fincher')!.id_director,
        id_category: categories.find(c => c.name === 'Drama')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'The Social Network',
        description: 'La historia de la creación de Facebook y las consecuencias legales que siguieron.',
        duration: 120,
        release_date: 2010,
        rating: 7.7,
        id_director: directors.find(d => d.last_name === 'Fincher')!.id_director,
        id_category: categories.find(c => c.name === 'Drama')!.id_category
      }
    }),

    // Películas de Greta Gerwig
    prisma.movie.create({
      data: {
        title: 'Lady Bird',
        description: 'Una estudiante de secundaria navega por una relación turbulenta con su madre.',
        duration: 94,
        release_date: 2017,
        rating: 7.4,
        id_director: directors.find(d => d.last_name === 'Gerwig')!.id_director,
        id_category: categories.find(c => c.name === 'Drama')!.id_category
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Barbie',
        description: 'Barbie vive en Barbieland hasta que es expulsada por no ser una muñeca perfecta.',
        duration: 114,
        release_date: 2023,
        rating: 6.9,
        id_director: directors.find(d => d.last_name === 'Gerwig')!.id_director,
        id_category: categories.find(c => c.name === 'Comedia')!.id_category
      }
    })
  ]);

  console.log('✅ Películas creadas:', movies.length);

  console.log('🎉 Seed completado exitosamente!');
  console.log(`📊 Resumen:`);
  console.log(`   - ${categories.length} categorías`);
  console.log(`   - ${directors.length} directores`);
  console.log(`   - ${movies.length} películas`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });