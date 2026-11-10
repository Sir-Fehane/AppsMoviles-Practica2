import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeaturedCard, MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { Chip, EmptyState, SearchBar, SectionHeader, Skeleton } from '../components/ui';
import { useCinema } from '../context/CinemaContext';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';

const ALL = 'Todas';
const GAP = spacing.md;

export const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { movies, loading, reload } = useCinema();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...new Set(movies.map((m) => m.categoria?.Categoria).filter(Boolean))],
    [movies]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movies.filter((m) => {
      const matchesQuery =
        !q || m.Titulo?.toLowerCase().includes(q) || m.director?.Director?.toLowerCase().includes(q);
      const matchesCategory = category === ALL || m.categoria?.Categoria === category;
      return matchesQuery && matchesCategory;
    });
  }, [movies, query, category]);

  const isFiltering = query.trim().length > 0 || category !== ALL;
  const featured = movies.slice(0, 3);
  const featuredWidth = width - spacing.md * 2 - spacing.xl;
  const cardWidth = (width - spacing.md * 2 - GAP) / 2;

  const openMovie = useCallback(
    (movie) => navigation.navigate('MovieDetail', { movieId: movie.Identificador }),
    [navigation]
  );

  const header = (
    <View style={{ paddingTop: insets.top + spacing.xs }}>
      <View style={styles.brandRow}>
        <View>
          <Text style={type.caption}>Bienvenido a</Text>
          <Text style={styles.brand} accessibilityRole="header">
            CINE<Text style={{ color: colors.brand }}> EXPO</Text>
          </Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar película o director" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        accessibilityLabel="Filtros por categoría"
      >
        {categories.map((c) => (
          <Chip key={c} label={c} selected={c === category} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>

      {!isFiltering && (loading || featured.length > 0) && (
        <View style={styles.section}>
          <SectionHeader title="Destacadas" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={featuredWidth + spacing.sm}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
          >
            {loading
              ? [0, 1].map((i) => (
                  <Skeleton key={i} style={{ width: featuredWidth, aspectRatio: 16 / 10, borderRadius: radius.lg }} />
                ))
              : featured.map((m) => (
                  <FeaturedCard key={m.Identificador} movie={m} width={featuredWidth} onPress={openMovie} />
                ))}
          </ScrollView>
        </View>
      )}

      <View style={[styles.section, { marginBottom: 0 }]}>
        <SectionHeader title={isFiltering ? `Resultados (${filtered.length})` : 'En cartelera'} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={loading ? [1, 2, 3, 4] : filtered}
        keyExtractor={(item, index) => (loading ? `skeleton-${index}` : String(item.Identificador))}
        numColumns={2}
        columnWrapperStyle={styles.column}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            {loading ? <MovieCardSkeleton /> : <MovieCard movie={item} onPress={openMovie} />}
          </View>
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="film-outline"
            title="No encontramos películas"
            message="Prueba con otro título, director o categoría."
            actionLabel="Limpiar filtros"
            onAction={() => {
              setQuery('');
              setCategory(ALL);
            }}
          />
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} tintColor={colors.accent} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  brand: {
    fontFamily: fonts.extrabold,
    fontSize: 28,
    letterSpacing: 1,
    color: colors.textPrimary,
  },
  searchWrap: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  chips: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  column: {
    gap: GAP,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
