# CineApp - Proyecto Completo (Fullstack)

Sistema completo para la gestión y simulación de salas de cine con cartelera móvil.

## Componentes del Proyecto

1. **Base de Datos (MySQL en Podman):**
   - Contenedor: `mysql-server` (puerto `3306`)
   - Base de datos: `cine_db` con tablas `Directores`, `Categorias`, `Peliculas`.
   - Archivo de esquema y datos: `cine_db.sql`.

2. **Backend (FastAPI + SQLAlchemy):**
   - Directorio: `backend/`
   - APIs REST completas para Películas, Directores y Categorías.
   - Documentación Swagger automática en `http://localhost:8000/docs`.

3. **Frontend (React Native + Expo):**
   - Directorio: `frontend/`
   - Catálogo con filtros y búsqueda.
   - Detalle de cada película con sinopsis y ficha técnica.
   - Simulador interactivo de sala de cines con selección de asientos en tiempo real y boleto digital.

---

## Cómo Iniciar Todo el Sistema

### Terminal 1: Base de Datos (Podman)
El contenedor `mysql-server` ya está corriendo. Si alguna vez lo detienes o reinicias la máquina:
```bash
# Iniciar el contenedor existente
podman start mysql-server

# O recrearlo con compose si fuera necesario
podman compose up -d
```

### Terminal 2: Backend (FastAPI)
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
> La API estará disponible en `http://localhost:8000` y la documentación interactiva en `http://localhost:8000/docs`.

### Terminal 3: Frontend (Expo)
```bash
cd frontend
npx expo start
```
- Presiona **`w`** para abrirlo en el navegador web.
- Presiona **`a`** para abrir en emulador de Android.
- O escanea el código QR desde la app **Expo Go** en tu celular.
