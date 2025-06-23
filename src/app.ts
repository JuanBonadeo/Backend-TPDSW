import express from 'express';
import { router as routerCategories } from './Categories/category.routes.js';
import { router as routerMovies} from './Movies/movie.routes.js';

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