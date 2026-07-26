export const shadows = {
  sm: '0 2px 8px rgba(27, 61, 47, 0.04)',
  md: '0 8px 24px rgba(27, 61, 47, 0.08)',
  lg: '0 16px 40px rgba(27, 61, 47, 0.12)',
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const;

export type Shadows = typeof shadows;
