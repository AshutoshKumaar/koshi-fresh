export const zIndex = {
  base: 1,
  dropdown: 100,
  sticky: 200,      // Navbar
  overlay: 300,     // Modal background shadows
  drawer: 400,      // Cart, Wishlist
  toast: 500,       // Notification center
} as const;

export type ZIndex = typeof zIndex;
