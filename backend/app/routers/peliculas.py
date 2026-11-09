from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Categoria, Director, Pelicula
from app.schemas import PeliculaCreate, PeliculaResponse, PeliculaUpdate

router = APIRouter(
    prefix="/peliculas",
    tags=["Películas"]
)

@router.get("/", response_model=List[PeliculaResponse])
def listar_peliculas(
    skip: int = 0,
    limit: int = 100,
    id_categoria: Optional[int] = Query(None, description="Filtrar por ID de Categoría"),
    id_director: Optional[int] = Query(None, description="Filtrar por ID de Director"),
    busqueda: Optional[str] = Query(None, description="Buscar por título de la película"),
    db: Session = Depends(get_db)
):
    """Obtener la lista de películas con filtros opcionales."""
    query = db.query(Pelicula)

    if id_categoria is not None:
        query = query.filter(Pelicula.IDCategoria == id_categoria)
    if id_director is not None:
        query = query.filter(Pelicula.IDDirector == id_director)
    if busqueda:
        query = query.filter(Pelicula.Titulo.ilike(f"%{busqueda}%"))

    return query.offset(skip).limit(limit).all()

@router.get("/{id_pelicula}", response_model=PeliculaResponse)
def obtener_pelicula(id_pelicula: int, db: Session = Depends(get_db)):
    """Obtener los detalles de una película por su Identificador."""
    pelicula = db.query(Pelicula).filter(Pelicula.Identificador == id_pelicula).first()
    if not pelicula:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Película con ID {id_pelicula} no encontrada"
        )
    return pelicula

@router.post("/", response_model=PeliculaResponse, status_code=status.HTTP_201_CREATED)
def crear_pelicula(pelicula_in: PeliculaCreate, db: Session = Depends(get_db)):
    """Registrar una nueva película."""
    # Validar existencia de director si se proporciona
    if pelicula_in.IDDirector is not None:
        director = db.query(Director).filter(Director.IDDirector == pelicula_in.IDDirector).first()
        if not director:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No existe un Director con el ID {pelicula_in.IDDirector}"
            )

    # Validar existencia de categoría si se proporciona
    if pelicula_in.IDCategoria is not None:
        categoria = db.query(Categoria).filter(Categoria.Identificador == pelicula_in.IDCategoria).first()
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No existe una Categoría con el ID {pelicula_in.IDCategoria}"
            )

    nueva_pelicula = Pelicula(**pelicula_in.model_dump())
    db.add(nueva_pelicula)
    db.commit()
    db.refresh(nueva_pelicula)
    return nueva_pelicula

@router.put("/{id_pelicula}", response_model=PeliculaResponse)
def actualizar_pelicula(id_pelicula: int, pelicula_in: PeliculaUpdate, db: Session = Depends(get_db)):
    """Actualizar datos de una película existente."""
    pelicula = db.query(Pelicula).filter(Pelicula.Identificador == id_pelicula).first()
    if not pelicula:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Película con ID {id_pelicula} no encontrada"
        )

    # Validar director si viene en la actualización
    if pelicula_in.IDDirector is not None:
        director = db.query(Director).filter(Director.IDDirector == pelicula_in.IDDirector).first()
        if not director:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No existe un Director con el ID {pelicula_in.IDDirector}"
            )

    # Validar categoría si viene en la actualización
    if pelicula_in.IDCategoria is not None:
        categoria = db.query(Categoria).filter(Categoria.Identificador == pelicula_in.IDCategoria).first()
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No existe una Categoría con el ID {pelicula_in.IDCategoria}"
            )

    update_data = pelicula_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(pelicula, key, value)

    db.commit()
    db.refresh(pelicula)
    return pelicula

@router.delete("/{id_pelicula}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pelicula(id_pelicula: int, db: Session = Depends(get_db)):
    """Eliminar una película por su Identificador."""
    pelicula = db.query(Pelicula).filter(Pelicula.Identificador == id_pelicula).first()
    if not pelicula:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Película con ID {id_pelicula} no encontrada"
        )
    db.delete(pelicula)
    db.commit()
    return None
