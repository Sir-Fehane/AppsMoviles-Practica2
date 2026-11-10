// Paleta semántica de CineApp — "sala a oscuras con un foco".
// Usa siempre estos tokens en los componentes; nunca hex sueltos.
export const colors = {
  // Superficies
  background: '#0A0A12',
  surface: '#15151F',
  surfaceRaised: '#1F1F2C',
  border: '#2A2A3A',
  scrim: 'rgba(5, 5, 10, 0.72)',

  // Texto (contraste ≥ 4.5:1 sobre background y surface)
  textPrimary: '#F8FAFC',
  textSecondary: '#A1A1B5',
  textMuted: '#8B8BA0',

  // Acción principal (CTA, selección)
  accent: '#F5B301',
  accentPressed: '#D99E00',
  onAccent: '#0F0F17',

  // Marca (logo, etiqueta "Estreno")
  brand: '#E50914',
  onBrand: '#FFFFFF',

  // Estados (siempre acompañados de ícono o texto)
  success: '#22C55E',
  warning: '#EAB308',
  danger: '#EF4444',

  // Asientos (la fase 5 añadirá formas además de color)
  seatAvailable: '#2A2A3A',
  seatAvailableBorder: '#3D3D52',
  seatSelected: '#F5B301',
  seatOccupied: '#1A1A24',
  seatVip: '#F5B301',

  screenGlow: 'rgba(245, 179, 1, 0.35)',
  shadow: '#000000',
};
