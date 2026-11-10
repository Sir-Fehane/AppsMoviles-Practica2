import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme/tokens';

// Gradientes cinematográficos; se asigna uno estable por película.
const PALETTES = [
  ['#3B1C6B', '#12081F'],
  ['#7A1F1F', '#1A0707'],
  ['#0F4C5C', '#04161B'],
  ['#5C3B0F', '#1A1004'],
  ['#1F3A7A', '#070F21'],
  ['#5C0F4C', '#1A0416'],
  ['#2F5C0F', '#0B1A04'],
];

const hash = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/**
 * Póster generado a partir del título y la categoría (el backend aún no
 * expone imágenes). Cuando exista `PosterURL`, sustituir el gradiente por expo-image.
 */
export const PosterArt = ({ movie, aspectRatio = 2 / 3, showTitle = true, titleSize = 18, style }) => {
  const palette = PALETTES[hash(`${movie?.Titulo}${movie?.categoria?.Categoria}`) % PALETTES.length];
  const title = (movie?.Titulo || '').split(':')[0];

  return (
    <View
      style={[styles.wrapper, { aspectRatio }, style]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <LinearGradient colors={palette} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
      <Ionicons name="film-outline" size={140} color="rgba(255,255,255,0.06)" style={styles.watermark} />
      <LinearGradient
        colors={['transparent', 'rgba(10,10,18,0.85)']}
        style={styles.bottomFade}
      />
      {showTitle && (
        <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.15 }]} numberOfLines={3}>
          {title}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'flex-end',
  },
  watermark: {
    position: 'absolute',
    top: '12%',
    right: -24,
    transform: [{ rotate: '-12deg' }],
  },
  bottomFade: {
    ...StyleSheet.absoluteFillObject,
    top: '45%',
  },
  title: {
    fontFamily: fonts.extrabold,
    color: colors.textPrimary,
    padding: 12,
    letterSpacing: -0.3,
  },
});
