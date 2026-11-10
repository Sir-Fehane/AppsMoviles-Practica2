import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../components/ui';
import { useCinema } from '../context/CinemaContext';
import { colors, fonts, radius, spacing, touch, type } from '../theme/tokens';

const SOURCE_LABEL = {
  backend: { text: 'Conectado a la API', color: colors.success, icon: 'checkmark-circle' },
  mock_empty_db: { text: 'API sin datos · usando cartelera de ejemplo', color: colors.warning, icon: 'alert-circle' },
  mock_fallback: { text: 'Sin conexión · usando cartelera de ejemplo', color: colors.warning, icon: 'cloud-offline' },
  loading: { text: 'Conectando…', color: colors.textMuted, icon: 'sync' },
};

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { apiUrl, setApiUrl, connectionSource, reload, loading } = useCinema();
  const [input, setInput] = useState(apiUrl);
  const status = SOURCE_LABEL[connectionSource] || SOURCE_LABEL.loading;

  const save = () => {
    const url = input.trim().replace(/\/$/, '');
    if (url === apiUrl) reload();
    else setApiUrl(url);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + spacing.xs, paddingBottom: spacing.xl }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[type.headline, styles.pad]} accessibilityRole="header">
        Perfil
      </Text>

      <View style={[styles.card, styles.pad]}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.textSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.subtitle}>Invitado</Text>
          <Text style={type.caption}>Inicio de sesión disponible próximamente</Text>
        </View>
      </View>

      <Text style={[type.overline, styles.pad, styles.groupTitle]}>Ajustes de desarrollador</Text>

      <View style={[styles.card, styles.pad, styles.column]}>
        <View style={styles.statusRow} accessibilityLiveRegion="polite">
          <Ionicons name={status.icon} size={18} color={status.color} />
          <Text style={[type.label, { color: status.color, flex: 1 }]}>{status.text}</Text>
        </View>

        <Text style={type.label} nativeID="apiUrlLabel">
          URL del backend (FastAPI)
        </Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="http://192.168.1.50:8000"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          accessibilityLabelledBy="apiUrlLabel"
          accessibilityLabel="URL del backend"
        />
        <Text style={type.caption}>
          Emulador Android: http://10.0.2.2:8000 · Celular físico: la IP local de tu computadora · Web/iOS: http://localhost:8000
        </Text>
        <PrimaryButton label="Guardar y recargar" icon="refresh" loading={loading} onPress={save} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pad: {
    marginHorizontal: spacing.md,
  },
  groupTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing.sm,
    marginTop: 0,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    minHeight: touch.min,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textPrimary,
  },
});
