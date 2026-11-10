import { colors } from './colors';

// Escala de espaciado 4/8
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

// Tamaño mínimo de área táctil (Material 48dp / iOS 44pt)
export const touch = {
  min: 48,
};

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
};

// Roles tipográficos (escala 12 / 14 / 16 / 20 / 24 / 32)
export const type = {
  display: { fontFamily: fonts.extrabold, fontSize: 32, lineHeight: 38, color: colors.textPrimary },
  headline: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30, color: colors.textPrimary },
  title: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.textPrimary },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.textSecondary },
  bodySm: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.textPrimary },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.textMuted },
  overline: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
};

export const elevation = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};

export { colors };
