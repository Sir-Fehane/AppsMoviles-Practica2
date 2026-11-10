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

-- Datos iniciales de prueba
INSERT INTO Directores (Director) VALUES 
('Christopher Nolan'),
('Quentin Tarantino'),
('Hayao Miyazaki'),
('Guillermo del Toro'),
('Denis Villeneuve');

INSERT INTO Categorias (Categoria) VALUES 
('Ciencia Ficción'),
('Crimen / Drama'),
('Animación / Fantasía'),
('Fantasía Oscura'),
('Acción / Aventura');

INSERT INTO Peliculas (Titulo, IDDirector, Duracion, IDCategoria, Sinopsis) VALUES 
('Interstellar: Interestelar', 1, 169, 1, 'Un grupo de científicos y exploradores espaciales viajan a través de un agujero de gusano para encontrar un nuevo hogar para la humanidad.'),
('Pulp Fiction: Tiempos Violentos', 2, 154, 2, 'Las vidas de mafiosos, un boxeador y bandidos se entrelazan en historias de violencia y redención en Los Ángeles.'),
('El Viaje de Chihiro', 3, 125, 3, 'Chihiro queda atrapada en un mundo mágico habitado por espíritus luego de que sus padres son transformados en cerdos.'),
('El Laberinto del Fauno', 4, 119, 4, 'En la España de 1944, la joven Ofelia se adentra en un misterioso laberinto guiada por un fauno que le asegura ser una princesa.'),
('Dune: Parte Dos', 5, 166, 1, 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.');
