import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState, PrimaryButton, SecondaryButton } from '../components/ui';
import { useCinema } from '../context/CinemaContext';
import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { formatPrice } from '../utils/format';
import { formatDateKey } from '../utils/showtimes';
import { Stepper } from '../components/Stepper';
import QRCode from 'react-native-qrcode-svg';

export const TicketScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { bookings } = useCinema();
  const booking = bookings.find((b) => b.id === route.params?.bookingId);
  const fromPurchase = route.params?.fromPurchase !== false;
  const payAtBox = booking?.paymentMethod === 'taquilla';

  if (!booking) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState icon="ticket-outline" title="Boleto no encontrado" message="" actionLabel="Volver" onAction={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}
    >
      {fromPurchase && (
        <View style={styles.stepper}>
          <Stepper current={3} />
        </View>
      )}
      {fromPurchase && (
        <View style={styles.success} accessibilityLiveRegion="polite">
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={28} color={colors.background} />
          </View>
          <Text style={type.headline} accessibilityRole="header">¡Reserva confirmada!</Text>
          <Text style={type.bodySm}>Muestra este código al entrar a la sala.</Text>
        </View>
      )}

      <View style={styles.ticket}>
        <View style={styles.ticketTop}>
          <Text style={type.overline}>{booking.categoria || 'Película'}</Text>
          <Text style={styles.movieTitle}>{booking.movieTitle}</Text>
          <View style={styles.grid}>
            <Field label="Sala" value={booking.salaNombre} wide />
            <Field label="Función" value={`${formatDateKey(booking.dateKey)} · ${booking.schedule}`} />
            <Field label="Boletos" value={String(booking.seats.length)} />
            <Field label="Asientos" value={booking.seats.join(', ')} wide />
          </View>
        </View>

        {/* Perforación */}
        <View style={styles.perforation}>
          <View style={[styles.notch, { left: -14 }]} />
          <View style={styles.dashed} />
          <View style={[styles.notch, { right: -14 }]} />
        </View>

        <View style={styles.ticketBottom}>
          <View style={styles.qr} accessible accessibilityRole="image" accessibilityLabel={`Código QR del boleto ${booking.id}`}>
            <QRCode
              value={JSON.stringify({
                id: booking.id,
                movie: booking.movieId,
                show: booking.showKey,
                seats: booking.seats,
              })}
              size={168}
              color={colors.background}
              backgroundColor={colors.textPrimary}
              ecl="M"
            />
          </View>
          <Text style={styles.code}>{booking.id}</Text>
          <View style={styles.totalRow}>
            <Text style={type.bodySm}>{payAtBox ? 'Por pagar en taquilla' : 'Total pagado'}</Text>
            <Text style={styles.total}>{formatPrice(booking.totalPrice)} MXN</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        {fromPurchase ? (
          <>
            <PrimaryButton label="Volver a cartelera" onPress={() => navigation.navigate('Tabs', { screen: 'Cartelera' })} />
            <SecondaryButton
              label="Ver mis boletos"
              icon="ticket-outline"
              onPress={() => navigation.navigate('Tabs', { screen: 'Boletos' })}
            />
          </>
        ) : (
          <SecondaryButton label="Cerrar" icon="close" onPress={() => navigation.goBack()} />
        )}
      </View>
    </ScrollView>
  );
};

const Field = ({ label, value, wide }) => (
  <View style={[styles.field, wide && { width: '100%' }]}>
    <Text style={type.caption}>{label}</Text>
    <Text style={styles.fieldValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.lg,
  },
  stepper: {
    width: '100%',
    maxWidth: 380,
  },
  success: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  ticket: {
    width: '100%',
    maxWidth: 380,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ticketTop: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  movieTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md,
  },
  field: {
    width: '50%',
    gap: 2,
  },
  fieldValue: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  perforation: {
    height: 28,
    justifyContent: 'center',
  },
  notch: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dashed: {
    marginHorizontal: spacing.lg,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  ticketBottom: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  qr: {
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.textPrimary,
  },
  code: {
    fontFamily: fonts.bold,
    fontSize: 16,
    letterSpacing: 2,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  totalRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.accent,
  },
  actions: {
    width: '100%',
    maxWidth: 380,
    gap: spacing.sm,
  },
});
