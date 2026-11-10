import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Vibración ligera; en web no hace nada.
const safe = (fn) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
};

export const haptic = {
  selection: () => safe(() => Haptics.selectionAsync()),
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};

/** Respeta el ajuste "Reducir movimiento" del sistema. */
export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduced).catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduced);
    return () => sub?.remove?.();
  }, []);
  return reduced;
};
