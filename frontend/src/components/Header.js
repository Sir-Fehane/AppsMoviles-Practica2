import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { colors } from '../theme/colors';

export const Header = ({ connectionSource, currentApiUrl, onSaveApiUrl }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputUrl, setInputUrl] = useState(currentApiUrl);

  const isConnected = connectionSource === 'backend';

  const handleSave = () => {
    onSaveApiUrl(inputUrl);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <Text style={styles.logoIcon}>🎬</Text>
          <View>
            <Text style={styles.brandTitle}>CINE EXPO</Text>
            <Text style={styles.brandSubtitle}>Simulador de Salas & Cartelera</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.statusBadge, isConnected ? styles.statusOnline : styles.statusOffline]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.statusDot, isConnected ? styles.dotOnline : styles.dotOffline]} />
          <Text style={styles.statusText}>
            {isConnected ? 'API Online' : 'Simulación'}
          </Text>
          <Text style={styles.configIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para configurar la IP del Backend */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Conexión con FastAPI</Text>
            <Text style={styles.modalDescription}>
              Ingresa la URL del backend. Si estás en emulador Android usa http://10.0.2.2:8000. Si estás en celular físico usa la IP de tu computadora (ej: http://192.168.1.50:8000).
            </Text>

            <TextInput
              style={styles.input}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="http://192.168.1.XX:8000"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btn, styles.btnSave]}
                onPress={handleSave}
              >
                <Text style={styles.btnTextSave}>Guardar y Recargar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    fontSize: 32,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  statusOnline: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22c55e',
  },
  statusOffline: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#eab308',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: '#22c55e',
  },
  dotOffline: {
    backgroundColor: '#eab308',
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  configIcon: {
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 22,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnCancel: {
    backgroundColor: colors.surfaceLight,
  },
  btnSave: {
    backgroundColor: colors.primary,
  },
  btnTextCancel: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  btnTextSave: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
