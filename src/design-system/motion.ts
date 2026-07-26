export const motion = {
  transition: {
    default: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    smooth: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    springy: { type: 'spring', stiffness: 300, damping: 25 },
  },
  variants: {
    fadeInUp: {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -15 },
    }
  }
} as const;

export type Motion = typeof motion;
