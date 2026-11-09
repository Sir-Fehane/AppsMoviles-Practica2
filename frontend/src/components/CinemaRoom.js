import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../theme/colors';

const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const CinemaRoom = ({ movie, onBack, onConfirmBooking }) => {
  const sala = movie.sala || {
    nombre: 'Sala 1 - Principal',
    filas: 5,
    columnas: 8,
    precioBoleto: 100,
    horarios: ['16:00', '18:30', '21:00'],
    occupiedSeats: ['A3', 'B4', 'C2']
  };

  const [selectedSchedule, setSelectedSchedule] = useState(sala.horarios[0] || '18:00');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState(sala.occupiedSeats || []);

  const toggleSeat = (seatId, isVip) => {
    if (occupiedSeats.includes(seatId)) {
      return; // Asiento ocupado
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Por favor selecciona al menos un asiento.');
      return;
    }

    const pricePerSeat = sala.precioBoleto || 100;
    const totalPrice = selectedSeats.length * pricePerSeat;

    onConfirmBooking({
      movie,
      salaNombre: sala.nombre,
      schedule: selectedSchedule,
      seats: selectedSeats,
      totalPrice,
      ticketsCount: selectedSeats.length,
    });
  };

  const pricePerSeat = sala.precioBoleto || 100;
  const totalPrice = selectedSeats.length * pricePerSeat;

  return (
    <View style={styles.container}>
      {/* Barra superior de la Sala */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>⬅ Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.movieTitle} numberOfLines={1}>{movie.Titulo}</Text>
          <Text style={styles.salaBadge}>{sala.nombre}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Selector de Horarios */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>🕒 Selecciona un Horario:</Text>
          <View style={styles.scheduleRow}>
            {sala.horarios.map((horario) => {
              const isSelected = selectedSchedule === horario;
              return (
                <TouchableOpacity
                  key={horario}
                  style={[styles.schedulePill, isSelected && styles.schedulePillActive]}
                  onPress={() => setSelectedSchedule(horario)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.scheduleText, isSelected && styles.scheduleTextActive]}>
                    {horario}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pantalla de Cine Simulada */}
        <View style={styles.screenWrapper}>
          <View style={styles.screenCurve} />
          <View style={styles.screenLight} />
          <Text style={styles.screenText}>P A N T A L L A</Text>
        </View>

        {/* Matriz interactiva de asientos */}
        <View style={styles.seatsGrid}>
          {Array.from({ length: sala.filas }).map((_, rowIndex) => {
            const rowLetter = ROW_LETTERS[rowIndex] || `R${rowIndex + 1}`;
            const isVipRow = rowIndex === sala.filas - 1; // Última fila es VIP

            return (
              <View key={rowLetter} style={styles.row}>
                <Text style={styles.rowLabel}>{rowLetter}</Text>

                <View style={styles.rowSeats}>
                  {Array.from({ length: sala.columnas }).map((_, colIndex) => {
                    const seatNumber = colIndex + 1;
                    const seatId = `${rowLetter}${seatNumber}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    // Estilos dinámicos según el estado del asiento
                    let seatStyle = styles.seatAvailable;
                    let seatLabelColor = colors.textSecondary;

                    if (isOccupied) {
                      seatStyle = styles.seatOccupied;
                      seatLabelColor = '#ffffff';
                    } else if (isSelected) {
                      seatStyle = styles.seatSelected;
                      seatLabelColor = '#ffffff';
                    } else if (isVipRow) {
                      seatStyle = styles.seatVip;
                      seatLabelColor = '#000000';
                    }

                    return (
                      <TouchableOpacity
                        key={seatId}
                        style={[styles.seat, seatStyle]}
                        onPress={() => toggleSeat(seatId, isVipRow)}
                        disabled={isOccupied}
                        activeOpacity={0.6}
                      >
                        <Text style={[styles.seatNumber, { color: seatLabelColor }]}>
                          {isOccupied ? '✕' : seatNumber}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.rowLabel}>{rowLetter}</Text>
              </View>
            );
          })}
        </View>

        {/* Leyenda de Asientos */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatAvailable]} />
            <Text style={styles.legendText}>Disponible</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatSelected]} />
            <Text style={styles.legendText}>Seleccionado</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatOccupied]} />
            <Text style={styles.legendText}>Ocupado</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatVip]} />
            <Text style={styles.legendText}>Fila VIP</Text>
          </View>
        </View>
      </ScrollView>

      {/* Barra Inferior con Resumen y Confirmación */}
      <View style={styles.checkoutBar}>
        <View style={styles.checkoutInfo}>
          <Text style={styles.checkoutSeats}>
            {selectedSeats.length > 0
              ? `Asientos: ${selectedSeats.join(', ')}`
              : 'Ningún asiento seleccionado'}
          </Text>
          <Text style={styles.checkoutPrice}>
            Total: ${totalPrice} MXN ({selectedSeats.length} boletos)
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            selectedSeats.length === 0 && styles.confirmButtonDisabled
          ]}
          onPress={handleBooking}
          disabled={selectedSeats.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>🎟️ Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    gap: 12,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
  headerTextContainer: {
    flex: 1,
  },
  movieTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  salaBadge: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scheduleSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  schedulePill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  schedulePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  scheduleText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  scheduleTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  screenWrapper: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 26,
  },
  screenCurve: {
    width: '78%',
    height: 8,
    backgroundColor: colors.accent,
    borderRadius: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  screenLight: {
    width: '70%',
    height: 16,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  screenText: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 6,
    marginTop: 8,
    fontWeight: '700',
  },
  seatsGrid: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    width: 16,
    textAlign: 'center',
  },
  rowSeats: {
    flexDirection: 'row',
    gap: 6,
  },
  seat: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  seatAvailable: {
    backgroundColor: colors.seatAvailable,
    borderColor: colors.seatAvailableBorder,
  },
  seatSelected: {
    backgroundColor: colors.seatSelected,
    borderColor: '#16a34a',
  },
  seatOccupied: {
    backgroundColor: colors.seatOccupied,
    borderColor: '#b91c1c',
  },
  seatVip: {
    backgroundColor: colors.seatVip,
    borderColor: '#ca8a04',
  },
  seatNumber: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 24,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  checkoutBar: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutInfo: {
    flex: 1,
    marginRight: 12,
  },
  checkoutSeats: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  checkoutPrice: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.surfaceLight,
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
