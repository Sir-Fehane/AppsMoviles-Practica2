# Backend API - Cine y Películas

API desarrollada con **FastAPI** y **SQLAlchemy** conectada a **MySQL**, diseñada para alimentar la aplicación móvil.

## Estructura del Proyecto

```
backend/
├── app/
│   ├── database.py       # Configuración y conexión con MySQL
│   ├── models.py         # Modelos de base de datos (SQLAlchemy)
│   ├── schemas.py        # Esquemas de validación (Pydantic)
│   └── routers/          # Endpoints CRUD
│       ├── categorias.py
│       ├── directores.py
│       └── peliculas.py
├── .env                  # Variables de entorno locales
├── .env.example          # Plantilla de variables de entorno
├── main.py               # Entrada principal de la aplicación FastAPI
└── requirements.txt      # Dependencias del proyecto
```

## Requisitos Previos

- Python 3.10+
- Servidor MySQL activo y base de datos `cine_db` creada (utilizando el script `cine_db.sql`).

## Instalación y Ejecución

1. **Navegar a la carpeta del backend:**
   ```bash
   cd backend
   ```

2. **Crear y activar un entorno virtual (recomendado):**
   ```bash
   python3 -m venv venv
   source venv/bin/activate    # En Linux / macOS
   # venv\Scripts\activate     # En Windows
   ```

3. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar las credenciales de la base de datos:**
   Revisa y edita el archivo `.env` según la configuración de tu MySQL:
   ```env
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=cine_db
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   > **Nota para móviles:** Usar `--host 0.0.0.0` permite que emuladores o dispositivos físicos en la misma red local puedan acceder a la API a través de la IP de tu computadora (por ejemplo, `http://192.168.x.x:8000`).

6. **Documentación Interactiva:**
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## Endpoints Disponibles

### Películas (`/peliculas`)
- `GET /peliculas`: Listar películas (permite filtrar por `id_categoria`, `id_director` y `busqueda`).
- `GET /peliculas/{id}`: Obtener detalles de una película.
- `POST /peliculas`: Crear una nueva película.
- `PUT /peliculas/{id}`: Actualizar película.
- `DELETE /peliculas/{id}`: Eliminar película.

### Directores (`/directores`)
- `GET /directores`: Listar directores.
- `GET /directores/{id}`: Obtener director por ID.
- `POST /directores`: Registrar nuevo director.
- `PUT /directores/{id}`: Actualizar director.
- `DELETE /directores/{id}`: Eliminar director.

### Categorías (`/categorias`)
- `GET /categorias`: Listar categorías.
- `GET /categorias/{id}`: Obtener categoría por ID.
- `POST /categorias`: Crear nueva categoría.
- `PUT /categorias/{id}`: Actualizar categoría.
- `DELETE /categorias/{id}`: Eliminar categoría.
