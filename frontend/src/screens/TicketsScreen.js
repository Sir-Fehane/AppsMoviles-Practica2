import React, { useMemo } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PosterArt } from '../components/PosterArt';
import { EmptyState } from '../components/ui';
import { useCinema } from '../context/CinemaContext';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { formatPrice } from '../utils/format';
import { formatDateKey, isBookingPast } from '../utils/showtimes';

const byShow = (a, b) => (a.showKey || '').localeCompare(b.showKey || '');

export const TicketsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { bookings, getMovie } = useCinema();

  const sections = useMemo(() => {
    const upcoming = bookings.filter((b) => !isBookingPast(b)).sort(byShow);
    const past = bookings.filter((b) => isBookingPast(b)).sort((a, b) => byShow(b, a));
    return [
      upcoming.length && { title: 'Próximas funciones', data: upcoming },
      past.length && { title: 'Anteriores', data: past, past: true },
    ].filter(Boolean);
  }, [bookings]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xs }]}>
      <Text style={[type.headline, styles.heading]} accessibilityRole="header">
        Mis boletos
      </Text>
      <SectionList
        sections={sections}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={[type.overline, styles.sectionTitle]} accessibilityRole="header">
            {section.title}
          </Text>
        )}
        renderItem={({ item, section }) => {
          const movie = getMovie(item.movieId) || { Titulo: item.movieTitle, categoria: { Categoria: item.categoria } };
          const dateLabel = formatDateKey(item.dateKey);
          return (
            <Pressable
              onPress={() => navigation.navigate('Ticket', { bookingId: item.id, fromPurchase: false })}
              accessibilityRole="button"
              accessibilityLabel={`${item.movieTitle}, ${dateLabel} a las ${item.schedule}, asientos ${item.seats.join(', ')}${section.past ? ', función finalizada' : ''}`}
              style={({ pressed }) => [
                styles.card,
                section.past && styles.cardPast,
                pressed && { backgroundColor: colors.surfaceRaised },
              ]}
            >
              <View style={styles.thumb}>
                <PosterArt movie={movie} showTitle={false} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={type.subtitle} numberOfLines={2}>{item.movieTitle}</Text>
                <Text style={type.caption}>
                  {dateLabel} · {item.schedule} hrs · {(item.salaNombre || 'Sala').split(' - ')[0]}
                </Text>
                <Text style={[styles.seats, section.past && { color: colors.textMuted }]}>
                  Asientos {item.seats.join(', ')}
                </Text>
                {item.paymentMethod === 'taquilla' && !section.past && (
                  <Text style={styles.payNote}>Pago pendiente en taquilla</Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={styles.price}>{formatPrice(item.totalPrice)}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="ticket-outline"
            title="Aún no tienes boletos"
            message="Cuando reserves una función, tus boletos aparecerán aquí."
            actionLabel="Ver cartelera"
            onAction={() => navigation.navigate('Cartelera')}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPast: {
    opacity: 0.6,
  },
  thumb: {
    width: 56,
  },
  seats: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.accent,
  },
  payNote: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.warning,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
