import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PosterArt } from './PosterArt';
import { Skeleton } from './ui';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { formatDuration, formatPrice } from '../utils/format';

/** Tarjeta de póster para la cuadrícula de cartelera. Toda la tarjeta abre el detalle. */
export const MovieCard = memo(({ movie, onPress }) => {
  const categoria = movie.categoria?.Categoria || 'General';
  const precio = movie.sala?.precioBoleto;

  return (
    <Pressable
      onPress={() => onPress(movie)}
      accessibilityRole="button"
      accessibilityLabel={`${movie.Titulo}. ${categoria}, ${formatDuration(movie.Duracion)}`}
      accessibilityHint="Abre el detalle de la película"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <PosterArt movie={movie} titleSize={16} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.Titulo}
        </Text>
        <Text style={type.caption} numberOfLines={1}>
          {categoria} · {formatDuration(movie.Duracion)}
        </Text>
        {precio != null && <Text style={styles.price}>Desde {formatPrice(precio)}</Text>}
      </View>
    </Pressable>
  );
});

/** Tarjeta horizontal grande para el carrusel de destacados. */
export const FeaturedCard = memo(({ movie, onPress, width }) => (
  <Pressable
    onPress={() => onPress(movie)}
    accessibilityRole="button"
    accessibilityLabel={`Destacada: ${movie.Titulo}`}
    accessibilityHint="Abre el detalle de la película"
    style={({ pressed }) => [{ width }, pressed && styles.pressed]}
  >
    <PosterArt movie={movie} aspectRatio={16 / 10} showTitle={false} style={styles.featuredPoster} />
    <View style={styles.featuredOverlay} pointerEvents="none">
      <View style={styles.badge}>
        <Text style={styles.badgeText}>EN CARTELERA</Text>
      </View>
      <Text style={styles.featuredTitle} numberOfLines={2}>
        {movie.Titulo}
      </Text>
      <Text style={styles.featuredMeta} numberOfLines={1}>
        {movie.categoria?.Categoria || 'General'} · {formatDuration(movie.Duracion)} · {movie.sala?.nombre?.split(' - ')[1] || 'Sala'}
      </Text>
    </View>
  </Pressable>
));

export const MovieCardSkeleton = () => (
  <View style={styles.card}>
    <Skeleton style={{ aspectRatio: 2 / 3, width: '100%' }} />
    <View style={styles.info}>
      <Skeleton style={{ height: 16, width: '85%' }} />
      <Skeleton style={{ height: 12, width: '55%' }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  info: {
    paddingTop: spacing.xs,
    gap: 4,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  price: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.accent,
  },
  featuredPoster: {
    borderRadius: radius.lg,
  },
  featuredOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    gap: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.onBrand,
  },
  featuredTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 24,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  featuredMeta: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
