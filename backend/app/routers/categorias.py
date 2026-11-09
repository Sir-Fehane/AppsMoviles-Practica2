from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Categoria
from app.schemas import CategoriaCreate, CategoriaResponse, CategoriaUpdate

router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"]
)

@router.get("/", response_model=List[CategoriaResponse])
def listar_categorias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener la lista de categorías."""
    return db.query(Categoria).offset(skip).limit(limit).all()

@router.get("/{id_categoria}", response_model=CategoriaResponse)
def obtener_categoria(id_categoria: int, db: Session = Depends(get_db)):
    """Obtener una categoría por su Identificador."""
    categoria = db.query(Categoria).filter(Categoria.Identificador == id_categoria).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con ID {id_categoria} no encontrada"
        )
    return categoria

@router.post("/", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def crear_categoria(categoria_in: CategoriaCreate, db: Session = Depends(get_db)):
    """Crear una nueva categoría."""
    nueva_categoria = Categoria(**categoria_in.model_dump())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

@router.put("/{id_categoria}", response_model=CategoriaResponse)
def actualizar_categoria(id_categoria: int, categoria_in: CategoriaUpdate, db: Session = Depends(get_db)):
    """Actualizar una categoría existente."""
    categoria = db.query(Categoria).filter(Categoria.Identificador == id_categoria).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con ID {id_categoria} no encontrada"
        )
    
    update_data = categoria_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(categoria, key, value)

    db.commit()
    db.refresh(categoria)
    return categoria

@router.delete("/{id_categoria}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(id_categoria: int, db: Session = Depends(get_db)):
    """Eliminar una categoría por su Identificador."""
    categoria = db.query(Categoria).filter(Categoria.Identificador == id_categoria).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con ID {id_categoria} no encontrada"
        )
    db.delete(categoria)
    db.commit()
    return None
