export const MOCK_MOVIES = [
  {
    Identificador: 1,
    Titulo: "Interstellar: Interestelar",
    IDDirector: 1,
    Duracion: 169,
    IDCategoria: 1,
    Sinopsis: "Un grupo de científicos y exploradores espaciales se embarcan en un viaje a través de un agujero de gusano para encontrar un nuevo hogar para la humanidad ante la inminente extinción de la Tierra.",
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
    Titulo: "Pulp Fiction: Tiempos Violentos",
    IDDirector: 2,
    Duracion: 154,
    IDCategoria: 2,
    Sinopsis: "Las vidas de dos mafiosos, un boxeador en decadencia, la esposa de un gángster y dos bandidos se entrelazan en cuatro historias de violencia y redención en Los Ángeles.",
    director: { IDDirector: 2, Director: "Quentin Tarantino" },
    categoria: { Identificador: 2, Categoria: "Crimen / Drama" },
    sala: {
      nombre: "Sala 2 - Macro XE",
      filas: 5,
      columnas: 8,
      precioBoleto: 95,
      horarios: ["16:00", "19:15", "22:00"],
      occupiedSeats: ["B3", "B4", "C2", "C3", "D5", "D6"]
    }
  },
  {
    Identificador: 3,
    Titulo: "El Viaje de Chihiro",
    IDDirector: 3,
    Duracion: 125,
    IDCategoria: 3,
    Sinopsis: "Chihiro, una niña de diez años, queda atrapada en un mundo mágico habitado por espíritus, dioses y brujas luego de que sus padres son transformados en cerdos.",
    director: { IDDirector: 3, Director: "Hayao Miyazaki" },
    categoria: { Identificador: 3, Categoria: "Animación / Fantasía" },
    sala: {
      nombre: "Sala 3 - Sala Junior",
      filas: 5,
      columnas: 7,
      precioBoleto: 85,
      horarios: ["13:00", "15:45", "18:15"],
      occupiedSeats: ["A1", "A2", "B4", "C3", "C4", "E1", "E2"]
    }
  },
  {
    Identificador: 4,
    Titulo: "Parásitos (Parasite)",
    IDDirector: 4,
    Duracion: 132,
    IDCategoria: 4,
    Sinopsis: "Tanto Gi-taek como su familia están en el paro y malviven en un sótano. Cuando su hijo empieza a dar clases particulares en casa de los adinerados Park, ambas familias se ven envueltas en un incidente inesperado.",
    director: { IDDirector: 4, Director: "Bong Joon-ho" },
    categoria: { Identificador: 4, Categoria: "Suspenso / Comedia Negra" },
    sala: {
      nombre: "Sala 4 - VIP Lounge",
      filas: 4,
      columnas: 6,
      precioBoleto: 140,
      horarios: ["17:00", "20:00", "22:45"],
      occupiedSeats: ["A2", "A3", "B3", "C1", "C2"]
    }
  },
  {
    Identificador: 5,
    Titulo: "El Laberinto del Fauno",
    IDDirector: 5,
    Duracion: 119,
    IDCategoria: 3,
    Sinopsis: "En la España fascista de 1944, la joven Ofelia se adentra en un misterioso laberinto guiada por un fauno que le asegura que ella es una princesa legendaria.",
    director: { IDDirector: 5, Director: "Guillermo del Toro" },
    categoria: { Identificador: 3, Categoria: "Fantasía Oscura" },
    sala: {
      nombre: "Sala 5 - 4DX Dynamic",
      filas: 5,
      columnas: 8,
      precioBoleto: 125,
      horarios: ["16:30", "19:00", "21:40"],
      occupiedSeats: ["A5", "B1", "B2", "C6", "D4"]
    }
  }
];
