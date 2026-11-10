import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, iconSize, radius, spacing, touch, type } from '../theme/tokens';

/** Botón principal (una sola acción principal por pantalla). */
export const PrimaryButton = ({ label, icon, onPress, disabled, loading, style, accessibilityHint }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityHint={accessibilityHint}
    accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
    style={({ pressed }) => [
      styles.primary,
      pressed && { backgroundColor: colors.accentPressed },
      (disabled || loading) && styles.disabled,
      style,
    ]}
  >
    {loading ? (
      <ActivityIndicator color={colors.onAccent} />
    ) : (
      <>
        <Text style={styles.primaryText}>{label}</Text>
        {icon && <Ionicons name={icon} size={iconSize.md} color={colors.onAccent} />}
      </>
    )}
  </Pressable>
);

/** Botón secundario con contorno. */
export const SecondaryButton = ({ label, icon, onPress, style }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.secondary, pressed && { backgroundColor: colors.surfaceRaised }, style]}
  >
    {icon && <Ionicons name={icon} size={iconSize.md} color={colors.textPrimary} />}
    <Text style={styles.secondaryText}>{label}</Text>
  </Pressable>
);

/** Botón de solo ícono con área táctil de 48. Requiere `label` para lectores de pantalla. */
export const IconButton = ({ icon, label, onPress, variant = 'solid', color = colors.textPrimary, style }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    hitSlop={4}
    style={({ pressed }) => [
      styles.iconBtn,
      variant === 'solid' && styles.iconBtnSolid,
      variant === 'glass' && styles.iconBtnGlass,
      pressed && { opacity: 0.7 },
      style,
    ]}
  >
    <Ionicons name={icon} size={iconSize.lg} color={color} />
  </Pressable>
);

/** Chip de filtro seleccionable. */
export const Chip = ({ label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Filtrar por ${label}`}
    accessibilityState={{ selected: !!selected }}
    style={({ pressed }) => [
      styles.chip,
      selected && styles.chipSelected,
      pressed && !selected && { backgroundColor: colors.border },
    ]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </Pressable>
);

/** Etiqueta informativa con ícono decorativo. */
export const MetaPill = ({ icon, label, tone = 'default' }) => (
  <View style={[styles.metaPill, tone === 'brand' && { backgroundColor: colors.brand }]}>
    {icon && (
      <Ionicons
        name={icon}
        size={14}
        color={tone === 'brand' ? colors.onBrand : colors.textSecondary}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    )}
    <Text style={[styles.metaPillText, tone === 'brand' && { color: colors.onBrand }]}>{label}</Text>
  </View>
);

export const SearchBar = ({ value, onChangeText, placeholder }) => (
  <View style={styles.search}>
    <Ionicons name="search" size={iconSize.md} color={colors.textMuted} accessibilityElementsHidden importantForAccessibility="no" />
    <TextInput
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      accessibilityLabel={placeholder}
      returnKeyType="search"
      autoCorrect={false}
    />
    {value.length > 0 && (
      <Pressable
        onPress={() => onChangeText('')}
        accessibilityRole="button"
        accessibilityLabel="Borrar búsqueda"
        hitSlop={12}
        style={styles.searchClear}
      >
        <Ionicons name="close-circle" size={iconSize.md} color={colors.textMuted} />
      </Pressable>
    )}
  </View>
);

export const SectionHeader = ({ title, actionLabel, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={type.title} accessibilityRole="header">{title}</Text>
    {actionLabel && (
      <Pressable onPress={onAction} hitSlop={12} accessibilityRole="button">
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </Pressable>
    )}
  </View>
);

/** Bloque con brillo pulsante para estados de carga. */
export const Skeleton = ({ style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[styles.skeleton, { opacity }, style]} />;
};

export const EmptyState = ({ icon, title, message, actionLabel, onAction }) => (
  <View style={styles.empty}>
    <View style={styles.emptyIcon}>
      <Ionicons name={icon} size={32} color={colors.textSecondary} />
    </View>
    <Text style={[type.subtitle, { textAlign: 'center' }]}>{title}</Text>
    <Text style={[type.bodySm, { textAlign: 'center' }]}>{message}</Text>
    {actionLabel && <SecondaryButton label={actionLabel} onPress={onAction} style={{ marginTop: spacing.xs }} />}
  </View>
);

const styles = StyleSheet.create({
  primary: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  primaryText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.onAccent,
  },
  disabled: {
    opacity: 0.4,
  },
  secondary: {
    minHeight: touch.min,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  secondaryText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  iconBtn: {
    width: touch.min,
    height: touch.min,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSolid: {
    backgroundColor: colors.surfaceRaised,
  },
  iconBtnGlass: {
    backgroundColor: 'rgba(10,10,18,0.55)',
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.textPrimary,
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.background,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
  },
  metaPillText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touch.min,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  searchClear: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionAction: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.accent,
  },
  skeleton: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
});
