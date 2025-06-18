import express from 'express';
import { router as routerMovies } from './Movies/movies.routes.js';
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
//# sourceMappingURL=app.js.map