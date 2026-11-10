export const formatDuration = (minutes) => {
  if (!minutes) return 'N/D';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

export const formatPrice = (amount) => `$${Number(amount || 0).toLocaleString('es-MX')}`;

// Código de boleto estable: se genera una sola vez al confirmar la compra.
export const generateTicketCode = () =>
  `EXPO-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
