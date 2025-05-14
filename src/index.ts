// Importar Express
import express from 'express';
const app = express();

// Middleware para parsear JSON (necesario para recibir datos en POST/PUT)
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor Express funcionando! 🚀');
});

// Definir el puerto
const PORT = 3000;

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("VIVA LA PEPA");
});