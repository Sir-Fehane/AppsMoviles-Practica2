import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../theme/tokens';

export const BOOKING_STEPS = ['Función', 'Asientos', 'Pago', 'Boleto'];

/** Indicador de progreso del flujo de compra. `current` empieza en 0. */
export const Stepper = ({ current, steps = BOOKING_STEPS }) => (
  <View
    style={styles.row}
    accessible
    accessibilityRole="progressbar"
    accessibilityLabel={`Paso ${current + 1} de ${steps.length}: ${steps[current]}`}
  >
    {steps.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={label}>
          {i > 0 && <View style={[styles.line, (done || active) && styles.lineActive]} />}
          <View style={styles.step}>
            <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
              {done ? (
                <Ionicons name="checkmark" size={12} color={colors.onAccent} />
              ) : (
                <Text style={[styles.dotText, active && { color: colors.onAccent }]}>{i + 1}</Text>
              )}
            </View>
            {active && <Text style={[styles.label, styles.labelActive]}>{label}</Text>}
          </View>
        </React.Fragment>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dotDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dotText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.textMuted,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.textPrimary,
  },
  line: {
    flex: 1,
    height: 1.5,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.border,
  },
  lineActive: {
    backgroundColor: colors.accent,
  },
});
