import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMovies, API_BASE_URL } from '../api/api';
import { generateTicketCode } from '../utils/format';
import { getShowKey, getSimulatedOccupied } from '../utils/showtimes';

const CinemaContext = createContext(null);
const BOOKINGS_KEY = '@cineapp/bookings/v1';

export const CinemaProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionSource, setConnectionSource] = useState('loading');
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [bookings, setBookings] = useState([]);

  const loadMovies = useCallback(async (url) => {
    setLoading(true);
    const result = await fetchMovies(url);
    setMovies(result.movies || []);
    setConnectionSource(result.source);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMovies(apiUrl);
  }, [apiUrl, loadMovies]);

  // Persistencia local de boletos: se cargan al iniciar y se guardan en cada cambio.
  const [bookingsHydrated, setBookingsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(BOOKINGS_KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw) : [];
        if (Array.isArray(saved)) setBookings((prev) => [...prev, ...saved]);
      })
      .catch((e) => console.warn('No se pudieron leer los boletos guardados:', e.message))
      .finally(() => setBookingsHydrated(true));
  }, []);

  useEffect(() => {
    if (!bookingsHydrated) return;
    AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)).catch((e) =>
      console.warn('No se pudieron guardar los boletos:', e.message)
    );
  }, [bookings, bookingsHydrated]);

  const getMovie = useCallback(
    (id) => movies.find((m) => m.Identificador === id),
    [movies]
  );

  // Asientos ocupados de una función concreta: simulados + reservados por el usuario.
  const getOccupiedSeats = useCallback(
    (movie, dateKey, time) => {
      const showKey = getShowKey(dateKey, time);
      const simulated = getSimulatedOccupied(movie.Identificador, movie.sala, showKey);
      const booked = bookings
        .filter((b) => b.movieId === movie.Identificador && b.showKey === showKey)
        .flatMap((b) => b.seats);
      return [...new Set([...simulated, ...booked])];
    },
    [bookings]
  );

  // Registra la reserva y devuelve el boleto creado.
  const confirmBooking = useCallback(({ movie, dateKey, schedule, seats, totalPrice, paymentMethod }) => {
    const booking = {
      id: generateTicketCode(),
      createdAt: Date.now(),
      movieId: movie.Identificador,
      movieTitle: movie.Titulo,
      categoria: movie.categoria?.Categoria,
      salaNombre: movie.sala?.nombre,
      dateKey,
      schedule,
      showKey: getShowKey(dateKey, schedule),
      seats,
      totalPrice,
      paymentMethod,
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  }, []);

  const value = useMemo(
    () => ({
      movies,
      loading,
      connectionSource,
      apiUrl,
      setApiUrl,
      reload: () => loadMovies(apiUrl),
      getMovie,
      bookings,
      confirmBooking,
      getOccupiedSeats,
    }),
    [movies, loading, connectionSource, apiUrl, loadMovies, getMovie, bookings, confirmBooking, getOccupiedSeats]
  );

  return <CinemaContext.Provider value={value}>{children}</CinemaContext.Provider>;
};

export const useCinema = () => {
  const ctx = useContext(CinemaContext);
  if (!ctx) throw new Error('useCinema debe usarse dentro de <CinemaProvider>');
  return ctx;
};
