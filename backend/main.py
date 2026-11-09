from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import categorias, directores, peliculas

# Crea las tablas si aún no existen en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Cine y Películas",
    description="Backend en FastAPI para la gestión de películas, directores y categorías para consumo móvil.",
    version="1.0.0"
)

# Configuración de CORS para permitir conexiones desde emuladores y dispositivos móviles
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de rutas
app.include_router(peliculas.router)
app.include_router(directores.router)
app.include_router(categorias.router)

@app.get("/", tags=["General"])
def root():
    return {
        "status": "online",
        "message": "Bienvenido a la API de Cine y Películas",
        "docs": "/docs",
        "redoc": "/redoc"
    }
