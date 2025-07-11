import express from 'express';
import cors from 'cors';
import { auth } from './utils/auth.js';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { router as routerCategories } from './Categories/category.routes.js';
import { router as routerMovies} from './Movies/movie.routes.js';
import { router as routerActors } from './Actors/actor.routes.js';
import { router as routerDirectors } from './Directors/director.routes.js';
import { router as routerMovieActors } from './Movie-Actor/movie-actor.routes.js';
import { router as routerAuth} from './Auth/auth.routes.js';


const app = express();
app.use(cors({
  origin: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.all("/api/auth/*", toNodeHandler(auth));


app.get('/', (req, res) => {
  res.send('¡Servidor Express funcionando! 🚀');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
});

app.use('/movies', routerMovies);
app.use('/categories', routerCategories)
app.use('/actors', routerActors);
app.use('/directors', routerDirectors);
app.use('/movie-actors', routerMovieActors);

app.use('/auth', routerAuth);