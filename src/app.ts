import express from 'express';
import { router as routerCategories } from './modules/Categories/category.routes.js';
import { router as routerMovies } from './modules/Movies/movie.routes.js';
import { router as routerActors } from './modules/Actors/actor.routes.js';
import { router as routerDirectors } from './modules/Directors/director.routes.js';
import { router as routerMovieActors } from './modules/Movie-Actor/movie-actor.routes.js';
import { router as routerAuth } from './modules/Auth/auth.routes.js';
import { router as routerFavourites } from './modules/Favourites/favourite.routes.js';
import { router as routerReviews } from './modules/Review/review.routes.js';
import { router as routerUsers } from './Users/user.routes.js';
import { ErrorLoggerMiddleware } from './middleware/errorLogger.js';
import { logger } from './utils/logger.js';


const app = express();

// Middleware de logging de requests
app.use(ErrorLoggerMiddleware.logRequest);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando! 🚀');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use('/favourites', routerFavourites);
app.use('/reviews', routerReviews);
app.use('/auth', routerAuth);
app.use('/users', routerUsers);

app.use('/movies', routerMovies);
app.use('/categories', routerCategories);
app.use('/actors', routerActors);
app.use('/directors', routerDirectors);
app.use('/movie-actors', routerMovieActors);

// Middleware global para errores no capturados (debe ir al final)
app.use(ErrorLoggerMiddleware.handleUncaughtError);

// Capturar errores no manejados de Node.js
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: { name: error.name, message: error.message, stack: error.stack } });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at Promise', { reason, promise });
});

