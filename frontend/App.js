import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { colors } from './src/theme/colors';
import { fetchMovies, API_BASE_URL } from './src/api/api';
import { Header } from './src/components/Header';
import { MovieCard } from './src/components/MovieCard';
import { MovieDetailModal } from './src/components/MovieDetailModal';
import { CinemaRoom } from './src/components/CinemaRoom';
import { TicketModal } from './src/components/TicketModal';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionSource, setConnectionSource] = useState('loading');
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);

  // Estados de navegación y modales
  const [detailMovie, setDetailMovie] = useState(null);
  const [activeRoomMovie, setActiveRoomMovie] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Estados de filtrado
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const loadData = async (url = apiUrl) => {
    setLoading(true);
    const result = await fetchMovies(url);
    setMovies(result.movies || []);
    setConnectionSource(result.source);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveApiUrl = (newUrl) => {
    setApiUrl(newUrl);
    loadData(newUrl);
  };

  const handleConfirmBooking = (bookingData) => {
    // Si se reservó en la sala activa, actualizar asientos ocupados en el estado local de la película
    setMovies((prevMovies) =>
      prevMovies.map((m) => {
        if (m.Identificador === bookingData.movie.Identificador) {
          const updatedOccupied = [
            ...(m.sala?.occupiedSeats || []),
            ...bookingData.seats
          ];
          return {
            ...m,
            sala: {
              ...m.sala,
              occupiedSeats: updatedOccupied
            }
          };
        }
        return m;
      })
    );

    setActiveRoomMovie(null);
    setConfirmedBooking(bookingData);
  };

  // Obtener categorías únicas para las pestañas de filtro
  const categories = ['Todas', ...new Set(
    movies.map(m => m.categoria?.Categoria).filter(Boolean)
  )];

  // Películas filtradas por búsqueda y categoría
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.Titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director?.Director?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || movie.categoria?.Categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />

      {/* Si el usuario está dentro de la simulación de una sala, mostramos la pantalla de sala */}
      {activeRoomMovie ? (
        <CinemaRoom
          movie={activeRoomMovie}
          onBack={() => setActiveRoomMovie(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      ) : (
        <View style={styles.container}>
          {/* Header con estado de conexión a FastAPI */}
          <Header
            connectionSource={connectionSource}
            currentApiUrl={apiUrl}
            onSaveApiUrl={handleSaveApiUrl}
          />

          {/* Barra de búsqueda */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar película o director..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filtro horizontal de categorías */}
          <View style={styles.categoryContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Lista de Películas */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Cargando cartelera de cine...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredMovies}
              keyExtractor={(item) => (item.Identificador || Math.random()).toString()}
              renderItem={({ item }) => (
                <MovieCard
                  movie={item}
                  onSelectMovie={(movie) => setDetailMovie(movie)}
                  onEnterRoom={(movie) => setActiveRoomMovie(movie)}
                />
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🎬</Text>
                  <Text style={styles.emptyText}>No se encontraron películas</Text>
                  <Text style={styles.emptySubtext}>Prueba con otro término de búsqueda o categoría.</Text>
                </View>
              }
            />
          )}

          {/* Modal de Detalle de Película */}
          <MovieDetailModal
            movie={detailMovie}
            visible={!!detailMovie}
            onClose={() => setDetailMovie(null)}
            onEnterRoom={(movie) => setActiveRoomMovie(movie)}
          />

          {/* Modal de Boleto Simulado al Reservar */}
          <TicketModal
            booking={confirmedBooking}
            visible={!!confirmedBooking}
            onClose={() => setConfirmedBooking(null)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },
  clearIcon: {
    color: colors.textSecondary,
    fontSize: 14,
    padding: 4,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
});
