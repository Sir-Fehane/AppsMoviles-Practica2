import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  return `${hrs}h ${mins > 0 ? `${mins}m` : ''} (${minutes} minutos)`;
};

export const MovieDetailModal = ({ movie, visible, onClose, onEnterRoom }) => {
  if (!movie) return null;

  const directorName = movie.director?.Director || 'Director no asignado';
  const categoriaName = movie.categoria?.Categoria || 'General';
  const salaInfo = movie.sala || {
    nombre: 'Sala 1 - Principal',
    precioBoleto: 95,
    horarios: ['16:00', '18:30', '21:00']
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Cabecera con botón de cierre */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalle de la Película</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {/* Título y badge */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{movie.Titulo}</Text>
              <View style={styles.badgesRow}>
                <View style={styles.badgeCategory}>
                  <Text style={styles.badgeCategoryText}>🏷️ {categoriaName}</Text>
                </View>
                <View style={styles.badgeDuration}>
                  <Text style={styles.badgeDurationText}>⏱️ {formatDuration(movie.Duracion)}</Text>
                </View>
              </View>
            </View>

            {/* Ficha técnica */}
            <View style={styles.metaBox}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>🎬 Director</Text>
                <Text style={styles.metaValue}>{directorName}</Text>
              </View>

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>🏛️ Sala de Proyección</Text>
                <Text style={styles.metaValueHighlight}>{salaInfo.nombre}</Text>
              </View>

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>💵 Precio por Entrada</Text>
                <Text style={styles.metaValuePrice}>${salaInfo.precioBoleto} MXN</Text>
              </View>
            </View>

            {/* Sinopsis completa */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📖 Sinopsis</Text>
              <Text style={styles.sinopsisText}>
                {movie.Sinopsis || 'Esta película no cuenta con sinopsis registrada.'}
              </Text>
            </View>

            {/* Horarios disponibles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🕒 Funciones Disponibles</Text>
              <View style={styles.schedulesRow}>
                {salaInfo.horarios.map((h) => (
                  <View key={h} style={styles.scheduleBadge}>
                    <Text style={styles.scheduleText}>{h} hrs</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer botón a la Sala */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnSimular}
              onPress={() => {
                onClose();
                onEnterRoom(movie);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSimularText}>💺 Entrar al Simulador de Sala</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 0,
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeCategory: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCategoryText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeDuration: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeDurationText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '600',
  },
  metaBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  metaValueHighlight: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  metaValuePrice: {
    color: '#34d399',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sinopsisText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  schedulesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  scheduleBadge: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  scheduleText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  btnSimular: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSimularText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
