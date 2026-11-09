import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export const TicketModal = ({ booking, visible, onClose }) => {
  if (!booking) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.ticketCard}>
          {/* Cabecera del Boleto */}
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketType}>🎟️ BOLETO DE CINE SIMULADO</Text>
            <Text style={styles.ticketCode}>#EXPO-{Math.floor(100000 + Math.random() * 900000)}</Text>
          </View>

          {/* Cuerpo del Boleto */}
          <View style={styles.ticketBody}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {booking.movie?.Titulo}
            </Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.label}>SALA</Text>
                <Text style={styles.valueHighlight}>{booking.salaNombre}</Text>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.label}>HORARIO</Text>
                <Text style={styles.value}>{booking.schedule} hrs</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.label}>ASIENTOS</Text>
                <Text style={styles.valueSeats}>{booking.seats?.join(', ')}</Text>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.label}>TOTAL PAGADO</Text>
                <Text style={styles.valueTotal}>${booking.totalPrice} MXN</Text>
              </View>
            </View>

            {/* Simulación de Código QR y Barras */}
            <View style={styles.barcodeSection}>
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>⬛ ⬜ ⬛ ⬛ ⬜ ⬛</Text>
                <Text style={styles.qrText}>⬜ ⬛ ⬜ ⬜ ⬛ ⬜</Text>
                <Text style={styles.qrText}>⬛ ⬛ ⬛ ⬛ ⬛ ⬛</Text>
              </View>
              <Text style={styles.scanText}>Escanea este código al ingresar a la sala</Text>
            </View>
          </View>

          {/* Botón de Salir */}
          <TouchableOpacity style={styles.btnFinish} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.btnFinishText}>Entendido, Volver a Cartelera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  ticketCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  ticketHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketType: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  ticketCode: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  ticketBody: {
    padding: 20,
  },
  movieTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoCol: {
    flex: 1,
  },
  label: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
  },
  valueHighlight: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  valueSeats: {
    color: '#047857',
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueTotal: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    marginVertical: 12,
  },
  barcodeSection: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  qrPlaceholder: {
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 12,
    letterSpacing: 4,
    color: '#1e293b',
  },
  scanText: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 6,
  },
  btnFinish: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnFinishText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
