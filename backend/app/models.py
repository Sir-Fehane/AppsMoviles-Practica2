from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Director(Base):
    __tablename__ = "Directores"

    IDDirector = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Director = Column(String(150), nullable=False)

    peliculas = relationship("Pelicula", back_populates="director")


class Categoria(Base):
    __tablename__ = "Categorias"

    Identificador = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Categoria = Column(String(100), nullable=False)

    peliculas = relationship("Pelicula", back_populates="categoria")


class Pelicula(Base):
    __tablename__ = "Peliculas"

    Identificador = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Titulo = Column(String(255), nullable=False)
    IDDirector = Column(Integer, ForeignKey("Directores.IDDirector", ondelete="SET NULL"), nullable=True)
    Duracion = Column(Integer, nullable=True)
    IDCategoria = Column(Integer, ForeignKey("Categorias.Identificador", ondelete="SET NULL"), nullable=True)
    Sinopsis = Column(Text, nullable=True)

    director = relationship("Director", back_populates="peliculas")
    categoria = relationship("Categoria", back_populates="peliculas")
