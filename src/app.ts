import express from 'express';
import { router as routerCategories } from './Categories/category.routes.js';
import { router as routerMovies} from './Movies/movie.routes.js';
import { router as routerActors } from './Actors/actor.routes.js';
import { router as routerDirectors } from './Directors/director.routes.js';
import { router as routerMovieActors } from './Movie-Actor/movie-actor.routes.js';


const app = express();


app.use(express.json());


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

