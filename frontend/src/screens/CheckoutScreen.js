import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PosterArt } from '../components/PosterArt';
import { Stepper } from '../components/Stepper';
import { EmptyState, IconButton, PrimaryButton, SecondaryButton } from '../components/ui';
import { useCinema } from '../context/CinemaContext';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { formatDuration, formatPrice } from '../utils/format';
import { haptic } from '../utils/feedback';
import { formatDateKey, getPriceBreakdown, isShowPast } from '../utils/showtimes';

export const PAYMENT_METHODS = [
  { id: 'app', icon: 'phone-portrait-outline', title: 'Pago en la app', subtitle: 'Simulado: no se realiza ningún cargo' },
  { id: 'taquilla', icon: 'storefront-outline', title: 'Pagar en taquilla', subtitle: 'Llega 20 min antes de la función' },
];

export const CheckoutScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { getMovie, getOccupiedSeats, confirmBooking } = useCinema();
  const { movieId, dateKey, time, seats = [] } = route.params || {};
  const movie = getMovie(movieId);
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!movie || seats.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState icon="alert-circle-outline" title="No hay nada que pagar" message="Vuelve a elegir tus asientos." actionLabel="Volver" onAction={() => navigation.goBack()} />
      </View>
    );
  }

  const sala = movie.sala;
  const { lines, total } = getPriceBreakdown(seats, sala);
  const [salaNumero, salaFormato] = sala.nombre.split(' - ');

  const handlePay = () => {
    setError(null);

    // Validaciones antes de confirmar, con una salida clara si algo cambió.
    if (isShowPast(dateKey, time)) {
      haptic.warning();
      setError({ message: 'Esta función ya comenzó. Elige otro horario.', action: 'Elegir otra función', target: 'MovieDetail' });
      return;
    }
    const taken = seats.filter((s) => getOccupiedSeats(movie, dateKey, time).includes(s));
    if (taken.length) {
      haptic.warning();
      setError({ message: `Los asientos ${taken.join(', ')} ya no están disponibles.`, action: 'Cambiar asientos', target: 'SeatSelection' });
      return;
    }

    setSubmitting(true);
    // Simula la latencia del procesamiento de pago.
    setTimeout(() => {
      const booking = confirmBooking({ movie, dateKey, schedule: time, seats, totalPrice: total, paymentMethod: method });
      haptic.success();
      navigation.reset({
        index: 1,
        routes: [{ name: 'Tabs' }, { name: 'Ticket', params: { bookingId: booking.id } }],
      });
    }, 900);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <View style={styles.headerRow}>
          <IconButton icon="chevron-back" label="Volver a los asientos" onPress={() => navigation.goBack()} />
          <Text style={[type.subtitle, { flex: 1 }]} accessibilityRole="header">
            Resumen de compra
          </Text>
        </View>
        <Stepper current={2} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Película y función */}
        <View style={[styles.card, styles.movieRow]}>
          <View style={styles.thumb}>
            <PosterArt movie={movie} showTitle={false} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={type.subtitle} numberOfLines={2}>{movie.Titulo}</Text>
            <Text style={type.caption}>
              {movie.categoria?.Categoria || 'General'} · {formatDuration(movie.Duracion)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Row icon="calendar-outline" label="Fecha" value={formatDateKey(dateKey)} />
          <Row icon="time-outline" label="Horario" value={`${time} hrs`} />
          <Row icon="videocam-outline" label="Sala" value={`${salaNumero}${salaFormato ? ` · ${salaFormato}` : ''}`} />
          <Row icon="grid-outline" label="Asientos" value={seats.join(', ')} accent />
        </View>

        {/* Desglose */}
        <Text style={[type.overline, styles.groupTitle]}>Desglose</Text>
        <View style={styles.card}>
          {lines.map((l) => (
            <View key={l.label} style={styles.lineRow}>
              <Text style={type.bodySm}>
                {l.count} × Boleto {l.label} ({formatPrice(l.unit)})
              </Text>
              <Text style={styles.lineValue}>{formatPrice(l.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.lineRow}>
            <Text style={type.subtitle}>Total</Text>
            <Text style={styles.total}>{formatPrice(total)} MXN</Text>
          </View>
        </View>

        {/* Método de pago */}
        <Text style={[type.overline, styles.groupTitle]} nativeID="paymentLabel">
          Método de pago
        </Text>
        <View style={{ gap: spacing.xs }} accessibilityRole="radiogroup" accessibilityLabelledBy="paymentLabel">
          {PAYMENT_METHODS.map((m) => {
            const selected = m.id === method;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  haptic.selection();
                  setMethod(m.id);
                }}
                accessibilityRole="radio"
                accessibilityLabel={`${m.title}. ${m.subtitle}`}
                accessibilityState={{ checked: selected }}
                style={({ pressed }) => [
                  styles.card,
                  styles.method,
                  selected && styles.methodSelected,
                  pressed && !selected && { backgroundColor: colors.surfaceRaised },
                ]}
              >
                <Ionicons name={m.icon} size={22} color={selected ? colors.accent : colors.textSecondary} />
                <View style={{ flex: 1 }}>
                  <Text style={type.label}>{m.title}</Text>
                  <Text style={type.caption}>{m.subtitle}</Text>
                </View>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={selected ? colors.accent : colors.textMuted}
                />
              </Pressable>
            );
          })}
        </View>

        {error && (
          <View style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="assertive">
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={20} color={colors.danger} />
              <Text style={[type.bodySm, { color: colors.textPrimary, flex: 1 }]}>{error.message}</Text>
            </View>
            <SecondaryButton
              label={error.action}
              onPress={() => (error.target === 'SeatSelection' ? navigation.goBack() : navigation.pop(2))}
            />
          </View>
        )}

        <Text style={styles.disclaimer}>
          Esta es una compra de demostración. No se solicitan ni procesan datos de pago.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PrimaryButton
          label={method === 'app' ? `Pagar ${formatPrice(total)}` : `Reservar · ${formatPrice(total)} en taquilla`}
          icon="lock-closed"
          loading={submitting}
          onPress={handlePay}
          accessibilityHint="Confirma la compra y genera tu boleto"
        />
      </View>
    </View>
  );
};

const Row = ({ icon, label, value, accent }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color={colors.textMuted} accessibilityElementsHidden importantForAccessibility="no" />
    <Text style={[type.bodySm, { width: 80 }]}>{label}</Text>
    <Text style={[styles.infoValue, accent && { color: colors.accent }]} numberOfLines={2}>
      {value}
    </Text>
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
  content: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  movieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumb: {
    width: 56,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  groupTitle: {
    marginTop: spacing.md,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lineValue: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.accent,
    fontVariant: ['tabular-nums'],
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
  },
  methodSelected: {
    borderColor: colors.accent,
  },
  error: {
    marginTop: spacing.sm,
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  disclaimer: {
    ...type.caption,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  footer: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
