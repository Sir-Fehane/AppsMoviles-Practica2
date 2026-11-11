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
INSERT INTO Directores (IDDirector, Director) VALUES 
(1, 'Christopher Nolan'),
(2, 'Anthony y Joe Russo'),
(3, 'Mike Flanagan'),
(4, 'Guillermo del Toro');

INSERT INTO Categorias (Identificador, Categoria) VALUES 
(1, 'Ciencia Ficción'),
(2, 'Acción / Superhéroes'),
(3, 'Suspenso / Terror'),
(4, 'Drama Histórico / Biografía'),
(5, 'Fantasía Oscura');

INSERT INTO Peliculas (Identificador, Titulo, IDDirector, Duracion, IDCategoria, Sinopsis) VALUES 
(1, 'Interstellar: Interestelar', 1, 169, 1, 'Un grupo de científicos y exploradores espaciales viajan a través de un agujero de gusano para encontrar un nuevo hogar para la humanidad ante la extinción de la Tierra.'),
(2, 'Avengers Doomsday', 2, 180, 2, 'Los héroes de la Tierra y el multiverso deberán reunirse para confrontar la mayor amenaza existencial ante la llegada del temible Doctor Doom.'),
(3, 'Clayface', 3, 135, 3, 'La oscura y trágica transformación de un actor de Gotham que, tras un accidente con sustancias experimentales, adquiere la capacidad de moldear su cuerpo a voluntad sembrando el terror.'),
(4, 'Oppenheimer', 1, 180, 4, 'La vida del físico teórico J. Robert Oppenheimer al frente del Proyecto Manhattan y los dilemas morales tras la creación de la primera bomba atómica.'),
(5, 'El laberinto del fauno', 4, 119, 5, 'En la España de 1944, la joven Ofelia descubre un laberinto en ruinas donde un misterioso fauno le revela que ella es en realidad la princesa perdida de un reino subterráneo.');
