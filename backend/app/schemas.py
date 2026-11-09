from typing import Optional
from pydantic import BaseModel, ConfigDict

# --- Directores Schemas ---
class DirectorBase(BaseModel):
    Director: str

class DirectorCreate(DirectorBase):
    pass

class DirectorUpdate(BaseModel):
    Director: Optional[str] = None

class DirectorResponse(DirectorBase):
    IDDirector: int

    model_config = ConfigDict(from_attributes=True)


# --- Categorías Schemas ---
class CategoriaBase(BaseModel):
    Categoria: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    Categoria: Optional[str] = None

class CategoriaResponse(CategoriaBase):
    Identificador: int

    model_config = ConfigDict(from_attributes=True)


# --- Películas Schemas ---
class PeliculaBase(BaseModel):
    Titulo: str
    IDDirector: Optional[int] = None
    Duracion: Optional[int] = None
    IDCategoria: Optional[int] = None
    Sinopsis: Optional[str] = None

class PeliculaCreate(PeliculaBase):
    pass

class PeliculaUpdate(BaseModel):
    Titulo: Optional[str] = None
    IDDirector: Optional[int] = None
    Duracion: Optional[int] = None
    IDCategoria: Optional[int] = None
    Sinopsis: Optional[str] = None

class PeliculaResponse(PeliculaBase):
    Identificador: int
    director: Optional[DirectorResponse] = None
    categoria: Optional[CategoriaResponse] = None

    model_config = ConfigDict(from_attributes=True)
