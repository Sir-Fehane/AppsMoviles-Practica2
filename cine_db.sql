-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS cine_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cine_db;

-- Tabla Directores
CREATE TABLE IF NOT EXISTS Directores (
    IDDirector INT AUTO_INCREMENT PRIMARY KEY,
    Director VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

-- Tabla Categorías
CREATE TABLE IF NOT EXISTS Categorias (
    Identificador INT AUTO_INCREMENT PRIMARY KEY,
    Categoria VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Tabla Películas
CREATE TABLE IF NOT EXISTS Peliculas (
    Identificador INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(255) NOT NULL,
    IDDirector INT,
    Duracion INT COMMENT 'Duración en minutos',
    IDCategoria INT,
    Sinopsis TEXT,
    CONSTRAINT fk_peliculas_directores FOREIGN KEY (IDDirector) 
        REFERENCES Directores(IDDirector) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    CONSTRAINT fk_peliculas_categorias FOREIGN KEY (IDCategoria) 
        REFERENCES Categorias(Identificador) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
) ENGINE=InnoDB;