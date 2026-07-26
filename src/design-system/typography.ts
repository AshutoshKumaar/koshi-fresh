export const typography = {
  fonts: {
    sans: 'var(--font-geist-sans), sans-serif',
    mono: 'var(--font-geist-mono), monospace',
    serif: 'var(--font-cormorant-garamond), serif', // Premium elegant typography
  },
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    h3: '24px',
    h2: '36px',
    h1: '48px',
    hero: '64px',
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const;

export type Typography = typeof typography;
