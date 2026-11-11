export const MOCK_MOVIES = [
  {
    Identificador: 1,
    Titulo: "Interstellar: Interestelar",
    IDDirector: 1,
    Duracion: 169,
    IDCategoria: 1,
    Sinopsis: "Un grupo de científicos y exploradores espaciales viajan a través de un agujero de gusano para encontrar un nuevo hogar para la humanidad ante la extinción de la Tierra.",
    director: { IDDirector: 1, Director: "Christopher Nolan" },
    categoria: { Identificador: 1, Categoria: "Ciencia Ficción" },
    sala: {
      nombre: "Sala 1 - IMAX Láser",
      filas: 6,
      columnas: 8,
      precioBoleto: 110,
      horarios: ["15:30", "18:45", "21:30"],
      occupiedSeats: ["A3", "A4", "B2", "B5", "C4", "C5", "D1", "D8"]
    }
  },
  {
    Identificador: 2,
    Titulo: "Avengers Doomsday",
    IDDirector: 2,
    Duracion: 180,
    IDCategoria: 2,
    Sinopsis: "Los héroes de la Tierra y el multiverso deberán reunirse para confrontar la mayor amenaza existencial ante la llegada del temible Doctor Doom.",
    director: { IDDirector: 2, Director: "Anthony y Joe Russo" },
    categoria: { Identificador: 2, Categoria: "Acción / Superhéroes" },
    sala: {
      nombre: "Sala 2 - Macro XE 3D",
      filas: 6,
      columnas: 8,
      precioBoleto: 120,
      horarios: ["16:00", "19:30", "22:45"],
      occupiedSeats: ["B3", "B4", "C3", "C4", "C5", "D4", "D5"]
    }
  },
  {
    Identificador: 3,
    Titulo: "Clayface",
    IDDirector: 3,
    Duracion: 135,
    IDCategoria: 3,
    Sinopsis: "La oscura y trágica transformación de un actor de Gotham que, tras un accidente con sustancias experimentales, adquiere la capacidad de moldear su cuerpo a voluntad sembrando el terror.",
    director: { IDDirector: 3, Director: "Mike Flanagan" },
    categoria: { Identificador: 3, Categoria: "Suspenso / Terror" },
    sala: {
      nombre: "Sala 3 - Dolby Atmos",
      filas: 5,
      columnas: 8,
      precioBoleto: 105,
      horarios: ["17:00", "19:45", "22:15"],
      occupiedSeats: ["A2", "B4", "C2", "C6", "D3"]
    }
  },
  {
    Identificador: 4,
    Titulo: "Oppenheimer",
    IDDirector: 1,
    Duracion: 180,
    IDCategoria: 4,
    Sinopsis: "La vida del físico teórico J. Robert Oppenheimer al frente del Proyecto Manhattan y los dilemas morales tras la creación de la primera bomba atómica.",
    director: { IDDirector: 1, Director: "Christopher Nolan" },
    categoria: { Identificador: 4, Categoria: "Drama Histórico / Biografía" },
    sala: {
      nombre: "Sala 4 - VIP Lounge 70mm",
      filas: 4,
      columnas: 6,
      precioBoleto: 140,
      horarios: ["15:00", "18:30", "21:45"],
      occupiedSeats: ["A3", "B2", "B3", "C4"]
    }
  },
  {
    Identificador: 5,
    Titulo: "El laberinto del fauno",
    IDDirector: 4,
    Duracion: 119,
    IDCategoria: 5,
    Sinopsis: "En la España de 1944, la joven Ofelia descubre un laberinto en ruinas donde un misterioso fauno le revela que ella es en realidad la princesa perdida de un reino subterráneo.",
    director: { IDDirector: 4, Director: "Guillermo del Toro" },
    categoria: { Identificador: 5, Categoria: "Fantasía Oscura" },
    sala: {
      nombre: "Sala 5 - 4DX Dynamic",
      filas: 5,
      columnas: 8,
      precioBoleto: 115,
      horarios: ["16:30", "19:00", "21:30"],
      occupiedSeats: ["A5", "B1", "B2", "C6", "D4"]
    }
  }
];
