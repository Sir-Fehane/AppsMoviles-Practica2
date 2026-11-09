import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins > 0 ? `${mins}m` : ''}`;
};

export const MovieCard = ({ movie, onSelectMovie, onEnterRoom }) => {
  const directorName = movie.director?.Director || 'Director no asignado';
  const categoriaName = movie.categoria?.Categoria || 'General';
  const salaInfo = movie.sala || { nombre: 'Sala Estándar', precioBoleto: 90 };

  return (
    <View style={styles.card}>
      {/* Banner / Poster Placeholder estilizado */}
      <View style={styles.posterHeader}>
        <View style={styles.iconCircle}>
          <Text style={styles.posterIcon}>🎞️</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.Titulo}
          </Text>
          <View style={styles.badgesRow}>
            <View style={[styles.badge, styles.badgeCategory]}>
              <Text style={styles.badgeTextCategory}>🏷️ {categoriaName}</Text>
            </View>
            <View style={[styles.badge, styles.badgeDuration]}>
              <Text style={styles.badgeTextDuration}>⏱️ {formatDuration(movie.Duracion)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Info Media */}
      <View style={styles.body}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Director:</Text>
          <Text style={styles.infoValue} numberOfLines={1}>{directorName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Asignada a:</Text>
          <Text style={styles.salaHighlight}>{salaInfo.nombre}</Text>
        </View>

        <Text style={styles.sinopsis} numberOfLines={2}>
          {movie.Sinopsis || 'Sin sinopsis registrada.'}
        </Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.footerButtons}>
        <TouchableOpacity 
          style={styles.btnDetail}
          onPress={() => onSelectMovie(movie)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnDetailText}>ℹ️ Detalle</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnRoom}
          onPress={() => onEnterRoom(movie)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnRoomText}>💺 Entrar a Sala</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  posterHeader: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  posterIcon: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeCategory: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  badgeDuration: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  badgeTextCategory: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextDuration: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '600',
  },
  body: {
    padding: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  infoValue: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  salaHighlight: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  sinopsis: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  footerButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  btnDetail: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.surfaceBorder,
  },
  btnDetailText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  btnRoom: {
    flex: 1.2,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  btnRoomText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
