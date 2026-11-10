// Utilidades de funciones (fecha + horario) y precios de asientos.

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAYS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const VIP_SURCHARGE = 40;
export const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const pad = (n) => String(n).padStart(2, '0');
const toDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Próximos `count` días a partir de hoy. */
export const getUpcomingDates = (count = 5, now = new Date()) =>
  Array.from({ length: count }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    return {
      key: toDateKey(d),
      weekday: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DAYS[d.getDay()],
      day: d.getDate(),
      month: MONTHS[d.getMonth()],
      a11y: `${i === 0 ? 'Hoy, ' : i === 1 ? 'Mañana, ' : ''}${DAYS_LONG[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`,
    };
  });

/** Etiqueta corta para una fecha guardada: "Hoy", "Mañana" o "Vie 14 nov". */
export const formatDateKey = (key, now = new Date()) => {
  if (!key) return '';
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((date - today) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  return `${DAYS[date.getDay()]} ${d} ${MONTHS[m - 1]}`;
};

/** ¿La función ya empezó? (solo aplica al día de hoy). */
export const isShowPast = (dateKey, time, now = new Date()) => {
  if (dateKey !== toDateKey(now)) return false;
  const [h, min] = time.split(':').map(Number);
  return h * 60 + min <= now.getHours() * 60 + now.getMinutes();
};

/** ¿La función de una reserva ya pasó? (días anteriores o más temprano hoy). */
export const isBookingPast = (booking, now = new Date()) => {
  if (!booking?.dateKey) return false;
  const todayKey = toDateKey(now);
  return booking.dateKey < todayKey || isShowPast(booking.dateKey, booking.schedule, now);
};

export const getShowKey =(dateKey, time) => `${dateKey}|${time}`;

const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Mezcla final (fmix32) para repartir uniformemente entradas muy parecidas.
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
};

/**
 * Asientos ocupados simulados, estables para cada función (película + fecha + horario).
 * Más ocupación en las filas centrales y en horarios nocturnos.
 */
export const getSimulatedOccupied = (movieId, sala, showKey) => {
  const occupied = [];
  const night = Number(showKey.split('|')[1]?.split(':')[0]) >= 20;
  for (let r = 0; r < sala.filas; r++) {
    const centrality = 1 - Math.abs(r - (sala.filas - 1) / 2) / sala.filas;
    for (let c = 1; c <= sala.columnas; c++) {
      const id = `${ROW_LETTERS[r]}${c}`;
      const threshold = 0.12 + centrality * 0.18 + (night ? 0.08 : 0);
      if (hash(`${movieId}|${showKey}|${id}`) < threshold) occupied.push(id);
    }
  }
  return occupied;
};

export const isVipRow = (rowIndex, sala) => rowIndex === sala.filas - 1;

export const getSeatPrice = (seatId, sala) => {
  const rowIndex = ROW_LETTERS.indexOf(seatId[0]);
  const base = sala.precioBoleto || 100;
  return isVipRow(rowIndex, sala) ? base + VIP_SURCHARGE : base;
};

/** Desglose de precio por tipo de asiento. */
export const getPriceBreakdown = (seats, sala) => {
  const base = sala.precioBoleto || 100;
  const vip = seats.filter((s) => isVipRow(ROW_LETTERS.indexOf(s[0]), sala)).length;
  const general = seats.length - vip;
  const lines = [];
  if (general) lines.push({ label: 'General', count: general, unit: base, subtotal: general * base });
  if (vip) lines.push({ label: 'VIP', count: vip, unit: base + VIP_SURCHARGE, subtotal: vip * (base + VIP_SURCHARGE) });
  return { lines, total: lines.reduce((acc, l) => acc + l.subtotal, 0) };
};
