import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stepper } from '../components/Stepper';
import { EmptyState, IconButton, PrimaryButton } from '../components/ui';
import { useCinema } from '../context/CinemaContext';
import { colors, fonts, radius, spacing, touch, type } from '../theme/tokens';
import { formatPrice } from '../utils/format';
import { haptic, useReducedMotion } from '../utils/feedback';
import { formatDateKey, getPriceBreakdown, getSeatPrice, isVipRow, ROW_LETTERS, VIP_SURCHARGE } from '../utils/showtimes';

const MAX_SEATS = 8;
const LABEL_W = 20;
const AISLE = 12;
const SEAT_GAP = 6; // espacio visual entre asientos, incluido dentro del área táctil
const MAX_CELL = 48;

export const SeatSelectionScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const { getMovie, getOccupiedSeats } = useCinema();
  const { movieId, dateKey, time } = route.params || {};
  const movie = getMovie(movieId);

  const [selected, setSelected] = useState([]);
  const [notice, setNotice] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const bump = useRef(new Animated.Value(1)).current;

  const occupied = useMemo(
    () => (movie ? getOccupiedSeats(movie, dateKey, time) : []),
    [movie, dateKey, time, getOccupiedSeats]
  );

  const sala = movie?.sala;
  const breakdown = useMemo(() => (sala ? getPriceBreakdown(selected, sala) : { lines: [], total: 0 }), [selected, sala]);

  // Pequeño "pulso" del total al cambiar (desactivado con Reducir movimiento).
  useEffect(() => {
    if (reducedMotion || selected.length === 0) return;
    bump.setValue(1.08);
    Animated.spring(bump, { toValue: 1, friction: 5, tension: 160, useNativeDriver: true }).start();
  }, [breakdown.total, reducedMotion, bump, selected.length]);

  if (!movie || !sala) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState icon="alert-circle-outline" title="Función no disponible" message="" actionLabel="Volver" onAction={() => navigation.goBack()} />
      </View>
    );
  }

  // Tamaño de celda: se ajusta al ancho; en modo ampliado usa el mínimo táctil recomendado.
  const available = width - spacing.md * 2 - LABEL_W * 2 - AISLE;
  const fitCell = Math.min(MAX_CELL, Math.floor(available / sala.columnas));
  const cell = zoomed ? MAX_CELL : fitCell;
  const canZoom = fitCell < touch.min - 4;
  const aisleAfter = Math.floor(sala.columnas / 2) - 1;
  const freeCount = sala.filas * sala.columnas - occupied.length;
  const [salaNumero, salaFormato] = sala.nombre.split(' - ');

  const toggleSeat = (id) => {
    if (selected.includes(id)) {
      haptic.selection();
      setSelected((prev) => prev.filter((s) => s !== id));
      setNotice(null);
      return;
    }
    if (selected.length >= MAX_SEATS) {
      haptic.warning();
      setNotice(`Puedes elegir hasta ${MAX_SEATS} asientos por compra.`);
      return;
    }
    haptic.selection();
    setSelected((prev) => [...prev, id]);
  };

  const handleContinue = () => {
    const ordered = [...selected].sort((a, b) => a[0].localeCompare(b[0]) || Number(a.slice(1)) - Number(b.slice(1)));
    navigation.navigate('Checkout', { movieId, dateKey, time, seats: ordered });
  };

  const seatMap = (
    <View style={styles.grid}>
      {Array.from({ length: sala.filas }).map((_, r) => {
        const row = ROW_LETTERS[r];
        const vip = isVipRow(r, sala);
        return (
          <View key={row} style={[styles.row, vip && styles.vipRow]}>
            <Text style={styles.rowLabel}>{row}</Text>
            {Array.from({ length: sala.columnas }).map((__, c) => {
              const id = `${row}${c + 1}`;
              return (
                <Seat
                  key={id}
                  id={id}
                  number={c + 1}
                  row={row}
                  size={cell}
                  vip={vip}
                  price={getSeatPrice(id, sala)}
                  occupied={occupied.includes(id)}
                  selected={selected.includes(id)}
                  aisle={c === aisleAfter}
                  onToggle={toggleSeat}
                />
              );
            })}
            <View style={styles.rowLabelWrap}>
              {vip ? <Ionicons name="star" size={12} color={colors.seatVip} /> : <Text style={styles.rowLabel}>{row}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <View style={styles.headerRow}>
          <IconButton icon="chevron-back" label="Volver a elegir función" onPress={() => navigation.goBack()} />
          <View style={{ flex: 1 }}>
            <Text style={type.subtitle} numberOfLines={1} accessibilityRole="header">
              {movie.Titulo}
            </Text>
            <Text style={type.caption} numberOfLines={1}>
              {formatDateKey(dateKey)} · {time} hrs · {salaFormato || salaNumero}
            </Text>
          </View>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Cambiar función">
            <Text style={styles.change}>Cambiar</Text>
          </Pressable>
        </View>
        <Stepper current={1} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
        {/* Pantalla */}
        <View style={styles.screenWrap} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={styles.screenLine} />
          <Text style={styles.screenText}>PANTALLA</Text>
        </View>

        <View style={styles.mapToolbar}>
          <Text style={type.caption} accessibilityLiveRegion="polite">
            {freeCount} asientos libres
          </Text>
          {canZoom && (
            <Pressable
              onPress={() => setZoomed((z) => !z)}
              accessibilityRole="button"
              accessibilityLabel={zoomed ? 'Ajustar mapa a la pantalla' : 'Ampliar mapa de asientos'}
              accessibilityState={{ expanded: zoomed }}
              style={({ pressed }) => [styles.zoomBtn, pressed && { backgroundColor: colors.border }]}
            >
              <Ionicons name={zoomed ? 'contract-outline' : 'expand-outline'} size={16} color={colors.textPrimary} />
              <Text style={styles.zoomText}>{zoomed ? 'Ajustar' : 'Ampliar'}</Text>
            </Pressable>
          )}
        </View>

        {zoomed ? (
          <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingHorizontal: spacing.md }}>
            {seatMap}
          </ScrollView>
        ) : (
          seatMap
        )}

        {/* Leyenda */}
        <View style={styles.legend} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <LegendItem label="Libre"><SeatShape size={20} /></LegendItem>
          <LegendItem label="Tu selección"><SeatShape size={20} selected /></LegendItem>
          <LegendItem label="Ocupado"><SeatShape size={20} occupied /></LegendItem>
          <LegendItem label={`VIP +${formatPrice(VIP_SURCHARGE)}`}><SeatShape size={20} vip /></LegendItem>
        </View>

        {notice && (
          <View style={styles.notice} accessibilityLiveRegion="polite" accessibilityRole="alert">
            <Ionicons name="information-circle" size={18} color={colors.warning} />
            <Text style={[type.bodySm, { color: colors.warning, flex: 1 }]}>{notice}</Text>
          </View>
        )}
      </ScrollView>

      {/* Resumen y confirmación */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {selected.length > 0 ? (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedChips}>
              {selected.map((id) => (
                <Pressable
                  key={id}
                  onPress={() => toggleSeat(id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Quitar asiento ${id}`}
                  style={styles.selectedChip}
                >
                  <Text style={styles.selectedChipText}>{id}</Text>
                  <Ionicons name="close" size={14} color={colors.textSecondary} />
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.summaryRow}>
              <View style={{ flex: 1 }}>
                {breakdown.lines.map((l) => (
                  <Text key={l.label} style={type.caption}>
                    {l.count} × {l.label} {formatPrice(l.unit)}
                  </Text>
                ))}
              </View>
              <Animated.Text style={[styles.total, { transform: [{ scale: bump }] }]}>
                {formatPrice(breakdown.total)}
              </Animated.Text>
            </View>
          </>
        ) : (
          <Text style={[type.bodySm, { textAlign: 'center' }]}>Toca los asientos que quieras reservar</Text>
        )}
        <PrimaryButton
          label={selected.length ? `Continuar con ${selected.length} boleto${selected.length > 1 ? 's' : ''}` : 'Continuar'}
          icon="arrow-forward"
          disabled={selected.length === 0}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
};

/** Forma de butaca: respaldo redondeado arriba, base recta. */
const SeatShape = ({ size, selected, occupied, vip, children }) => (
  <View
    style={[
      styles.seatShape,
      { width: size, height: size, borderTopLeftRadius: size * 0.32, borderTopRightRadius: size * 0.32 },
      vip && styles.seatVip,
      selected && styles.seatSelected,
      occupied && styles.seatOccupied,
    ]}
  >
    {occupied ? (
      <Ionicons name="close" size={Math.max(10, size * 0.45)} color={colors.textMuted} />
    ) : selected ? (
      <Ionicons name="checkmark" size={Math.max(10, size * 0.5)} color={colors.onAccent} />
    ) : (
      children
    )}
  </View>
);

const Seat = memo(({ id, number, row, size, vip, price, occupied, selected, aisle, onToggle }) => {
  const status = occupied ? 'ocupado' : selected ? 'seleccionado' : 'disponible';
  return (
    <Pressable
      onPress={() => onToggle(id)}
      disabled={occupied}
      accessibilityRole="button"
      accessibilityLabel={`Fila ${row}, asiento ${number}${vip ? ', VIP' : ''}, ${status}${occupied ? '' : `, ${price} pesos`}`}
      accessibilityState={{ selected, disabled: occupied }}
      style={({ pressed }) => [
        { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
        aisle && { marginRight: AISLE },
        pressed && { transform: [{ scale: 0.9 }] },
      ]}
    >
      <SeatShape size={size - SEAT_GAP} selected={selected} occupied={occupied} vip={vip}>
        <Text style={[styles.seatNumber, { fontSize: size >= 40 ? 13 : 11 }]}>{number}</Text>
      </SeatShape>
    </Pressable>
  );
});

const LegendItem = ({ label, children }) => (
  <View style={styles.legendItem}>
    {children}
    <Text style={type.caption}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  change: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.accent,
  },
  screenWrap: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  screenLine: {
    width: '75%',
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  screenText: {
    ...type.overline,
    letterSpacing: 6,
    marginTop: spacing.sm,
  },
  mapToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 36,
  },
  zoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
  },
  zoomText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  grid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipRow: {
    marginTop: spacing.sm,
  },
  rowLabelWrap: {
    width: LABEL_W,
    alignItems: 'center',
  },
  rowLabel: {
    width: LABEL_W,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.textMuted,
  },
  seatShape: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.seatAvailableBorder,
    backgroundColor: colors.seatAvailable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatVip: {
    borderColor: colors.seatVip,
  },
  seatSelected: {
    backgroundColor: colors.seatSelected,
    borderColor: colors.seatSelected,
  },
  seatOccupied: {
    backgroundColor: colors.seatOccupied,
    borderColor: colors.seatOccupied,
  },
  seatNumber: {
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
  },
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedChips: {
    gap: spacing.xs,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
  },
  selectedChipText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.accent,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});
