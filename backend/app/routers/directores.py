from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Director
from app.schemas import DirectorCreate, DirectorResponse, DirectorUpdate

router = APIRouter(
    prefix="/directores",
    tags=["Directores"]
)

@router.get("/", response_model=List[DirectorResponse])
def listar_directores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener la lista de directores."""
    return db.query(Director).offset(skip).limit(limit).all()

@router.get("/{id_director}", response_model=DirectorResponse)
def obtener_director(id_director: int, db: Session = Depends(get_db)):
    """Obtener un director por su ID."""
    director = db.query(Director).filter(Director.IDDirector == id_director).first()
    if not director:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Director con ID {id_director} no encontrado"
        )
    return director

@router.post("/", response_model=DirectorResponse, status_code=status.HTTP_201_CREATED)
def crear_director(director_in: DirectorCreate, db: Session = Depends(get_db)):
    """Registrar un nuevo director."""
    nuevo_director = Director(**director_in.model_dump())
    db.add(nuevo_director)
    db.commit()
    db.refresh(nuevo_director)
    return nuevo_director

@router.put("/{id_director}", response_model=DirectorResponse)
def actualizar_director(id_director: int, director_in: DirectorUpdate, db: Session = Depends(get_db)):
    """Actualizar datos de un director existente."""
    director = db.query(Director).filter(Director.IDDirector == id_director).first()
    if not director:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Director con ID {id_director} no encontrado"
        )
    
    update_data = director_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(director, key, value)
    
    db.commit()
    db.refresh(director)
    return director

@router.delete("/{id_director}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_director(id_director: int, db: Session = Depends(get_db)):
    """Eliminar un director por su ID."""
    director = db.query(Director).filter(Director.IDDirector == id_director).first()
    if not director:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Director con ID {id_director} no encontrado"
        )
    db.delete(director)
    db.commit()
    return None
