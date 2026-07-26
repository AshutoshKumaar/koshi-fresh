import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';
import { motion } from './motion';
import { zIndex } from './z-index';

export const tokens = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  motion,
  zIndex,
} as const;

export type DesignTokens = typeof tokens;

export { colors } from './colors';
export { spacing } from './spacing';
export { radius } from './radius';
export { typography } from './typography';
export { shadows } from './shadows';
export { motion } from './motion';
export { zIndex } from './z-index';
