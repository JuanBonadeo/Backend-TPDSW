# Critio Backend

## Descripción general
Critio Backend es un servicio API REST desarrollado en Node.js que abastece a la plataforma Critio, una aplicación web para la reseña y recomendación de películas y series. El objetivo del proyecto es proveer endpoints seguros y consistentes para la gestión de usuarios, contenidos audiovisuales y sus interacciones. Se extrae toda la información de las peliculas, actores, etc de la [API de TMDB (The Movie Database)](https://www.themoviedb.org/documentation/api) siguiendo su documentación.

## Arquitectura del sistema
El proyecto adopta una arquitectura modular en capas, organizada alrededor de casos de uso y recursos de dominio.

- **Capa de presentación (Routes):** Define los endpoints HTTP mediante routers de Express y aplica middleware transversal como CORS, parseo de JSON y manejo de contexto.
- **Capa de aplicación (Controllers):** Implementa la lógica orquestadora de cada caso de uso, validando DTOs y coordinando el flujo entre la capa de presentación y la capa de acceso a datos.
- **Capa de acceso a datos (DAO/Prisma):** Centraliza la interacción con la base de datos PostgreSQL utilizando Prisma ORM, asegurando tipado estático y consultas consistentes.
- **Módulos de dominio:** Cada recurso (películas, categorías, actores, usuarios, reseñas, listas, autenticación) se encapsula en su propio módulo con rutas, controladores, DTOs y DAO específicos.
- **Utilidades y middleware:** Componentes reutilizables para manejo de errores, autenticación basada en JWT y construcción del contexto de petición.
- **Manejo de Errores:** Implemente la clase ErrorHandler, utilizada en la capa de Aplicacion, la cual se encarga del manejo integral de errores, contando errores ya preestablecidos, como por ejemplo el NotFoundError() y el UnauthorizedError(), ademas maneja los errores lanzados por Prisma y por Zod.
-**Logger**: Utiliza el middleware contextMiddleware, para obtener el contexto de todas las request, y el ResponseHandler, logea las respuesta.

Esta distribución permite aislar responsabilidades, facilitar pruebas y escalar nuevas funcionalidades sin afectar módulos existentes.


## Dependencias y tecnologías
- **Runtime:** Node.js 20 LTS
- **Lenguaje:** TypeScript 5.8.3
- **Framework web:** Express 4.21.2
- **ORM:** Prisma 6.10.0 con PostgreSQL 15
- **Autenticación y seguridad:** JSON Web Tokens (jsonwebtoken 9.0.2), bcryptjs 3.0.2, cookie-parser 1.4.7
- **Validación:** Zod 3.25.67
- **Logging:** Winston 3.17.0 y Chalk 5.5.0
- **Herramientas de desarrollo:** Vitest 3.2.4, ESLint + Prettier, TSC Watch, Nodemon

## Instalación
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JuanBonadeo/Backend-TPDSW.git
   cd Backend-TPDSW
   ```
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**
   - Duplicar el archivo `env.template` como `.env`.
   - Completar las credenciales de base de datos (`DATABASE_URL`), parámetros de autenticación (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `JWT_SECRET`), token de TMDB (`TMDB_BEARER_TOKEN`) y la URL autorizada para el frontend (`FRONTEND_URL_PROD`).
4. **Inicializar la base de datos**
   - Ejecutar PostgreSQL localmente o levantar el servicio incluido en `docker-compose.yml`:
     ```bash
     docker compose up -d
     ```
   - Aplicar las migraciones y generar el cliente Prisma:
     ```bash
     npx prisma migrate deploy
     npm run build
     ```

## Ejecución
- **Modo desarrollo**
  ```bash
  npm run dev
  ```
- **Modo producción**
  ```bash
  npm run build
  node dist/app.js
  ```
- **Ejecución de pruebas**
  ```bash
  npm test
  ```
- **Seed de datos opcional**
  ```bash
  npm run seed
  ```

## Alcance Funcional 
## Estructura del proyecto
```
Backend-TPDSW/
├── prisma/             # Definición del esquema y migraciones de Prisma
│   └── schema.prisma
├── src/
│   ├── app.ts          # Punto de entrada del servidor Express
│   ├── db/             # Inicialización de Prisma y utilidades de base de datos
│   ├── middleware/     # Middleware transversal (contexto, autenticación, etc.)
│   ├── modules/        # Módulos de dominio (Movies, Users, Reviews, Auth, etc.)
│   └── utils/          # Funciones compartidas de soporte
├── env.template        # Plantilla de variables de entorno
├── docker-compose.yml  # Orquestador para PostgreSQL en contenedor
├── package.json        # Scripts de npm y dependencias
└── tsconfig.json       # Configuración de TypeScript
```

## Contribución y mantenimiento
1. Crear una rama basada en `main` con un nombre descriptivo.
2. Mantener el estilo de código ejecutando `npm run lint` y `npm run format:check` antes de subir cambios.
3. Agregar o actualizar pruebas automatizadas relevantes (`npm test`).
4. Abrir un Pull Request con descripción técnica, enlazando issues relacionados y solicitando revisión.
5. Asegurar que las migraciones de Prisma estén sincronizadas con los cambios de modelo.

