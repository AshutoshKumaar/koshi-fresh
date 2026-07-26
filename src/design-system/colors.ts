export const colors = {
  brand: {
    forest: '#1B3D2F',       // Primary Dark Green (Representing natural foods, premium feel)
    forestLight: '#2C5E4A',  // Interactive hover forest variant
    sage: '#8A9A86',         // Muted green for highlights and badges
    clay: '#C4A484',         // Earthy warm secondary
    ivory: '#FAF7F0',        // Luxe background offset
    gold: '#D4AF37',         // Warm accent gold (Award, Organic markers)
  },
  neutral: {
    obsidian: '#1C1A17',     // Deep text primary color
    charcoal: '#33302C',     // Muted subheadings
    stone: '#706C66',        // Disabled status, borders
    sand: '#F0ECE3',         // Content background blocks
    white: '#FFFFFF',
  },
  feedback: {
    success: '#2E7D32',
    error: '#D32F2F',
    warning: '#ED6C02',
    info: '#0288D1',
  }
} as const;

export type Colors = typeof colors;
