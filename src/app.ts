import express from 'express';
import { router as routerCategories } from './modules/Categories/category.routes.js';
import { router as routerMovies } from './modules/Movies/movie.routes.js';
import { router as routerActors } from './modules/Actors/actor.routes.js';
import { router as routerDirectors } from './modules/Directors/director.routes.js';
import { router as routerMovieActors } from './modules/Movie-Actor/movie-actor.routes.js';
import { router as routerAuth } from './modules/Auth/auth.routes.js';
import { router as routerFavourites } from './modules/Favourites/favourite.routes.js';
import { router as routerToWatch } from './modules/ToWatch/toWatch.routes.js';
import { router as routerReviews } from './modules/Review/review.routes.js';
import { router as routerUsers } from './modules/Users/user.routes.js';
import { logger } from './utils/logger.js';
import { contextMiddleware } from './middleware/contextMiddleware.js';
import cors from "cors";


const app = express();

// Middleware de logging de requests
app.use(cors({ origin: "http://localhost:3000" })); // tu frontend


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(contextMiddleware);

app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando! 🚀');
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use('/api/favourites', routerFavourites);
app.use('/api/to-watch', routerToWatch);
app.use('/api/reviews', routerReviews);
app.use('/api/auth', routerAuth);
app.use('/api/users', routerUsers);
app.use('/api/movies', routerMovies);
app.use('/api/categories', routerCategories);
app.use('/api/actors', routerActors);
app.use('/api/directors', routerDirectors);
app.use('/api/movie-actors', routerMovieActors);



// Capturar errores no manejados de Node.js
// process.on('uncaughtException', (error) => {
//     logger.error('Uncaught Exception', { error: { name: error.name, message: error.message, stack: error.stack } });
//     process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//     logger.error('Unhandled Rejection at Promise', { reason, promise });
// });

