import express from 'express';
import { router as routerCategories } from './modules/Categories/category.routes.js';
import { router as routerMovies } from './modules/Movies/movie.routes.js';
import { router as routerActors } from './modules/Actors/actor.routes.js';
import { router as routerDirectors } from './modules/Directors/director.routes.js';
import { router as routerMovieActors } from './modules/Movie-Actor/movie-actor.routes.js';
import { router as routerAuth } from './modules/Auth/auth.routes.js';
import { router as routerFavourites } from './modules/Favourites/favourite.routes.js';
import { router as routerReviews } from './modules/Review/review.routes.js';


const app = express();
express.json();


app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando! 🚀');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use('/movies', routerMovies);
app.use('/categories', routerCategories);
app.use('/actors', routerActors);
app.use('/directors', routerDirectors);
app.use('/movie-actors', routerMovieActors);
app.use('/favourites', routerFavourites);
app.use('/reviews', routerReviews);
app.use('/auth', routerAuth);
