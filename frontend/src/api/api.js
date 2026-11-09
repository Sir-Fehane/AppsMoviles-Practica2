import { MOCK_MOVIES } from '../data/mockMovies';

// En Expo:
// - En emulador Android usar: http://10.0.2.2:8000
// - En dispositivo físico usar tu IP local: ej. http://192.168.1.XX:8000
// - En web o simulador iOS usar: http://localhost:8000
export const API_BASE_URL = 'http://localhost:8000';

const generateSalaForMovie = (movie, index) => {
  const salasNombres = [
    'Sala 1 - IMAX Láser',
    'Sala 2 - Macro XE',
    'Sala 3 - Sala Junior',
    'Sala 4 - VIP Lounge',
    'Sala 5 - 4DX Dynamic',
  ];
  const salaIndex = (index || movie.Identificador || 1) % salasNombres.length;
  const filas = 5;
  const columnas = 8;
  const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  // Generar algunos asientos ocupados aleatorios pero consistentes
  const occupiedSeats = [];
  for (let r = 0; r < filas; r++) {
    for (let c = 1; c <= columnas; c++) {
      if ((r + c + (movie.Identificador || 1)) % 5 === 0) {
        occupiedSeats.push(`${letras[r]}${c}`);
      }
    }
  }

  return {
    nombre: salasNombres[salaIndex],
    filas,
    columnas,
    precioBoleto: 95 + (salaIndex * 15),
    horarios: ['16:00', '18:30', '21:00'],
    occupiedSeats
  };
};

export const fetchMovies = async (baseUrl = API_BASE_URL) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${baseUrl}/peliculas/`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error en API: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // Enriquecer datos del backend con la simulación de sala
      return {
        movies: data.map((m, idx) => ({
          ...m,
          sala: generateSalaForMovie(m, idx)
        })),
        source: 'backend'
      };
    }

    // Si la BD está vacía, usar mock
    return {
      movies: MOCK_MOVIES,
      source: 'mock_empty_db'
    };
  } catch (error) {
    console.warn('Conexión con FastAPI no disponible, cargando datos locales:', error.message);
    return {
      movies: MOCK_MOVIES,
      source: 'mock_fallback',
      error: error.message
    };
  }
};
