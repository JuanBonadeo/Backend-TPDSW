# To-Do / Roadmap del Proyecto

0. [x] Mejorar seed

1. [x] Validaciones de inputs de data con Zod en todos los controladores

2. [x] Normalizar los return en todos los controladores para que tengan la misma estructura:
            { ok: true, message: "string", result: { ... } }  

3. [x] Listado de películas filtrado por categoría, o actor, o director

4. [x] Agregar paginación a listado anterior

5. [x] Hacer la Auth, CRUD de usuarios

6. [x] CRUD de favoritos

7. [] CRUD de reseñas @Slashy

8. [x] Usar la API de IMDB para cargar toda la data en el seed


## Manejo de Errores (PULIR)

1.  [ ] **Logging de errores** para debugging con winston
2.  [ ] **Middelware de manejo de errores** 

## Better-Auth (VERIFICAR FUNCIONAMIENTO)
- [ ] **Agregar role (user, admin)** 
- [ ] **Verificar middleware** protege todas las rutas necesarias
- [ ] **Probar logout** funciona correctamente

# 🎯 Para Aprobación Directa (OBLIGATORIO)

## Testing
- [ ] **1 test por integrante** (unit tests de controllers/services)
- [ ] **1 test de integración** (endpoint completo con auth)
- [ ] **Setup Jest/Vitest** con scripts en package.json

## Deploy y Documentación
- [ ] **Deploy backend** funcionando (Railway/Render/Heroku)
- [ ] **Swagger/OpenAPI** con todos los endpoints
- [ ] **Variables de entorno** configuradas (.env dev/prod)
- [ ] **README.md** con instrucciones de instalación

