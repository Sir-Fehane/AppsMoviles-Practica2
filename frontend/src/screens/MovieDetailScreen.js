import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PosterArt } from '../components/PosterArt';
import { Stepper } from '../components/Stepper';
import { EmptyState, IconButton, MetaPill, PrimaryButton } from '../components/ui';
import { useCinema } from '../context/CinemaContext';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { formatDuration, formatPrice } from '../utils/format';
import { haptic } from '../utils/feedback';
import { getUpcomingDates, isShowPast, VIP_SURCHARGE } from '../utils/showtimes';

const firstAvailable = (dateKey, horarios) => horarios.find((h) => !isShowPast(dateKey, h)) || null;

export const MovieDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { getMovie } = useCinema();
  const movie = getMovie(route.params?.movieId);
  const [expanded, setExpanded] = useState(false);

  const sala = movie?.sala || { nombre: 'Sala 1 - Principal', precioBoleto: 95, horarios: [] };
  const dates = useMemo(() => getUpcomingDates(5), []);

  // Si hoy ya no quedan funciones, arrancamos en el primer día con funciones.
  const initialDate = dates.find((d) => firstAvailable(d.key, sala.horarios)) || dates[0];
  const [dateKey, setDateKey] = useState(initialDate.key);
  const [time, setTime] = useState(() => firstAvailable(initialDate.key, sala.horarios));

  if (!movie) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState
          icon="alert-circle-outline"
          title="Película no disponible"
          message="Es posible que ya no esté en cartelera."
          actionLabel="Volver"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const [salaNumero, salaFormato] = sala.nombre.split(' - ');
  const sinopsis = movie.Sinopsis || 'Esta película no cuenta con sinopsis registrada.';
  const selectedDate = dates.find((d) => d.key === dateKey);

  const selectDate = (key) => {
    haptic.selection();
    setDateKey(key);
    // Conservamos el horario si sigue disponible en el nuevo día.
    setTime((prev) => (prev && !isShowPast(key, prev) ? prev : firstAvailable(key, sala.horarios)));
  };

  const selectTime = (h) => {
    haptic.selection();
    setTime(h);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 132 + insets.bottom }}>
        {/* Hero */}
        <View>
          <PosterArt movie={movie} aspectRatio={3 / 4} showTitle={false} style={styles.hero} />
          <LinearGradient
            colors={['rgba(10,10,18,0.6)', 'transparent', 'transparent', colors.background]}
            locations={[0, 0.25, 0.55, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.heroContent}>
            <Text style={type.overline}>{movie.categoria?.Categoria || 'General'}</Text>
            <Text style={styles.title} accessibilityRole="header">
              {movie.Titulo}
            </Text>
            <View style={styles.metaRow}>
              <MetaPill icon="time-outline" label={formatDuration(movie.Duracion)} />
              <MetaPill icon="videocam-outline" label={salaFormato || salaNumero} />
              <MetaPill icon="person-outline" label={movie.director?.Director || 'Sin director'} />
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* Sinopsis */}
          <View>
            <Text style={[type.subtitle, styles.sectionTitle]} accessibilityRole="header">
              Sinopsis
            </Text>
            <Text style={type.body} numberOfLines={expanded ? undefined : 3}>
              {sinopsis}
            </Text>
            {sinopsis.length > 140 && (
              <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={12} accessibilityRole="button">
                <Text style={styles.readMore}>{expanded ? 'Leer menos' : 'Leer más'}</Text>
              </Pressable>
            )}
          </View>

          {/* Selección de función */}
          <View style={styles.showSection}>
            <Stepper current={0} />

            <Text style={[type.subtitle, styles.sectionTitle, { marginTop: spacing.lg }]} accessibilityRole="header">
              Elige el día
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dates}
              style={styles.bleed}
            >
              {dates.map((d) => {
                const selected = d.key === dateKey;
                const hasShows = !!firstAvailable(d.key, sala.horarios);
                return (
                  <Pressable
                    key={d.key}
                    onPress={() => selectDate(d.key)}
                    disabled={!hasShows}
                    accessibilityRole="button"
                    accessibilityLabel={`${d.a11y}${hasShows ? '' : ', sin funciones disponibles'}`}
                    accessibilityState={{ selected, disabled: !hasShows }}
                    style={({ pressed }) => [
                      styles.dateCard,
                      selected && styles.dateCardSelected,
                      !hasShows && styles.disabled,
                      pressed && !selected && { backgroundColor: colors.surfaceRaised },
                    ]}
                  >
                    <Text style={[styles.dateWeekday, selected && styles.onAccent]}>{d.weekday}</Text>
                    <Text style={[styles.dateDay, selected && styles.onAccent]}>{d.day}</Text>
                    <Text style={[styles.dateMonth, selected && styles.onAccent]}>{d.month}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={[type.subtitle, styles.sectionTitle, { marginTop: spacing.lg }]} accessibilityRole="header">
              Elige el horario
            </Text>
            <View style={styles.formatCard}>
              <View style={styles.formatHeader}>
                <Ionicons name="videocam" size={18} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={type.label}>{salaFormato || 'Sala estándar'}</Text>
                  <Text style={type.caption}>{salaNumero}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.formatPrice}>{formatPrice(sala.precioBoleto)}</Text>
                  <Text style={type.caption}>VIP +{formatPrice(VIP_SURCHARGE)}</Text>
                </View>
              </View>
              <View style={styles.times}>
                {sala.horarios.map((h) => {
                  const past = isShowPast(dateKey, h);
                  const selected = h === time;
                  return (
                    <Pressable
                      key={h}
                      onPress={() => selectTime(h)}
                      disabled={past}
                      accessibilityRole="button"
                      accessibilityLabel={`${h} horas${past ? ', función ya iniciada' : ''}`}
                      accessibilityState={{ selected, disabled: past }}
                      style={({ pressed }) => [
                        styles.time,
                        selected && styles.timeSelected,
                        past && styles.disabled,
                        pressed && !selected && { backgroundColor: colors.surfaceRaised },
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          selected && styles.onAccent,
                          past && { textDecorationLine: 'line-through' },
                        ]}
                      >
                        {h}
                      </Text>
                      {past && <Text style={styles.timeNote}>Iniciada</Text>}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón atrás flotante */}
      <IconButton
        icon="chevron-back"
        label="Volver"
        variant="glass"
        onPress={() => navigation.goBack()}
        style={[styles.back, { top: insets.top + spacing.xs }]}
      />

      {/* CTA fijo con resumen de la función */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={{ flex: 1 }}>
          <Text style={type.caption} numberOfLines={1}>
            {time ? `${selectedDate?.weekday} ${selectedDate?.day} ${selectedDate?.month} · ${time}` : 'Sin horario'}
          </Text>
          <Text style={styles.footerPrice}>Desde {formatPrice(sala.precioBoleto)}</Text>
        </View>
        <PrimaryButton
          label={time ? 'Elegir asientos' : 'Elige un horario'}
          icon={time ? 'arrow-forward' : undefined}
          disabled={!time}
          style={{ flex: 1.4 }}
          onPress={() =>
            navigation.navigate('SeatSelection', { movieId: movie.Identificador, dateKey, time })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    borderRadius: 0,
    maxHeight: 520,
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 32,
    lineHeight: 38,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 4,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  readMore: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.accent,
    marginTop: spacing.xs,
  },
  showSection: {
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bleed: {
    marginHorizontal: -spacing.md,
  },
  dates: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  dateCard: {
    width: 68,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 2,
  },
  dateCardSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dateWeekday: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateDay: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  dateMonth: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  onAccent: {
    color: colors.onAccent,
  },
  disabled: {
    opacity: 0.4,
  },
  formatCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  formatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  formatPrice: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  times: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  time: {
    minHeight: 48,
    minWidth: 88,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  timeText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  timeNote: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
  },
  back: {
    position: 'absolute',
    left: spacing.md,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerPrice: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});
